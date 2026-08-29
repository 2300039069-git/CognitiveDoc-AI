import os
import shutil
import uuid
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import FileResponse, PlainTextResponse
from app.core.config import UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB
from app.core.security import get_current_user_payload
from app.db.models import DocumentRepository, SummaryRepository, ChatRepository, SystemLogRepository
from app.services.extractor import extract_text_and_metadata

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    tags: Optional[str] = Form(None),
    payload: Dict[str, Any] = Depends(get_current_user_payload)
):
    user_id = payload["sub"]
    original_filename = file.filename or "uploaded_doc.txt"
    file_ext = Path(original_filename).suffix.lower()

    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file_ext}'. Allowed formats: PDF, DOCX, TXT, MD"
        )

    # Generate unique storage filename
    unique_filename = f"{uuid.uuid4()}_{original_filename}"
    save_path = UPLOAD_DIR / unique_filename

    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    file_size_bytes = os.path.getsize(save_path)
    if file_size_bytes > MAX_FILE_SIZE_MB * 1024 * 1024:
        save_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB"
        )

    # Extract text and metadata
    extracted = extract_text_and_metadata(save_path, original_filename)
    
    if not extracted["text"].strip():
        extracted["text"] = "No readable text could be extracted from this document."

    parsed_tags = [t.strip() for t in tags.split(",") if t.strip()] if tags else [extracted["file_type"].upper(), "Uploaded"]

    doc = DocumentRepository.create_document(
        user_id=user_id,
        filename=unique_filename,
        original_name=original_filename,
        file_path=str(save_path),
        file_type=extracted["file_type"],
        file_size=extracted["file_size"],
        char_count=extracted["char_count"],
        word_count=extracted["word_count"],
        page_count=extracted["page_count"],
        extracted_text=extracted["text"],
        tags=parsed_tags
    )

    SystemLogRepository.log_event(
        "INFO", "DOC_INGESTION",
        f"Document {original_filename} ingested for user {user_id} ({extracted['word_count']} words)"
    )

    # Return lightweight document metadata (exclude 15MB raw text from JSON transfer)
    doc_res = {k: v for k, v in doc.items() if k != "extracted_text"}
    doc_res["preview_text"] = (doc.get("extracted_text", "")[:400] + "...") if doc.get("extracted_text") else ""

    return {
        "success": True,
        "message": "Document uploaded and parsed successfully",
        "document": doc_res
    }

@router.get("")
def get_documents(payload: Dict[str, Any] = Depends(get_current_user_payload)):
    user_id = payload["sub"]
    docs = DocumentRepository.get_user_documents(user_id)
    
    # Attach summary status to each document
    enhanced_docs = []
    for d in docs:
        summary = SummaryRepository.get_by_doc_id(d["id"])
        messages = ChatRepository.get_doc_messages(d["id"])
        # Don't return massive raw text in list view for performance
        d_summary = {k: v for k, v in d.items() if k != "extracted_text"}
        d_summary["has_summary"] = summary is not None
        d_summary["summary_id"] = summary["id"] if summary else None
        d_summary["message_count"] = len(messages)
        d_summary["preview_text"] = (d.get("extracted_text", "")[:240] + "...") if d.get("extracted_text") else ""
        enhanced_docs.append(d_summary)

    return enhanced_docs

@router.get("/{doc_id}")
def get_document_details(doc_id: str, payload: Dict[str, Any] = Depends(get_current_user_payload)):
    user_id = payload["sub"]
    doc = DocumentRepository.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    # Check authorization if not admin
    if doc["user_id"] != user_id and payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    summary = SummaryRepository.get_by_doc_id(doc_id)
    messages = ChatRepository.get_doc_messages(doc_id)

    return {
        **doc,
        "summary": summary,
        "chat_count": len(messages)
    }

@router.get("/{doc_id}/download")
def download_document(doc_id: str, format: Optional[str] = "original", payload: Dict[str, Any] = Depends(get_current_user_payload)):
    user_id = payload["sub"]
    doc = DocumentRepository.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    if doc["user_id"] != user_id and payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if format == "txt":
        return PlainTextResponse(
            content=doc["extracted_text"],
            headers={"Content-Disposition": f'attachment; filename="{doc["original_name"]}.txt"'}
        )

    file_path = Path(doc["file_path"])
    if file_path.exists():
        return FileResponse(
            path=str(file_path),
            filename=doc["original_name"],
            media_type="application/octet-stream"
        )
    else:
        # Return plain text fallback
        return PlainTextResponse(
            content=doc["extracted_text"],
            headers={"Content-Disposition": f'attachment; filename="{doc["original_name"]}.txt"'}
        )

@router.delete("/{doc_id}")
def delete_document(doc_id: str, payload: Dict[str, Any] = Depends(get_current_user_payload)):
    user_id = payload["sub"]
    role = payload.get("role", "user")
    
    doc = DocumentRepository.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    if doc["user_id"] != user_id and role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Remove physical file
    try:
        p = Path(doc["file_path"])
        p.unlink(missing_ok=True)
    except Exception:
        pass

    DocumentRepository.delete_document(doc_id, user_id=None if role == "admin" else user_id)
    return {"success": True, "message": "Document deleted successfully"}
