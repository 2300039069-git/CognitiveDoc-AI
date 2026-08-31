import sqlite3
import json
import uuid
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.db.database import get_db_connection
from app.db.mongodb import get_mongo_db

def dict_from_row(row: sqlite3.Row) -> Optional[Dict[str, Any]]:
    if row is None:
        return None
    d = dict(row)
    for key in ["tags", "bullet_points", "key_takeaways", "entities", "citations"]:
        if key in d and isinstance(d[key], str):
            try:
                d[key] = json.loads(d[key])
            except Exception:
                pass
    return d

def mongo_doc_to_dict(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Convert MongoDB BSON document to standard API dictionary."""
    if doc is None:
        return None
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d["_id"])
        del d["_id"]
    return d


# ================= USER REPOSITORY =================
class UserRepository:
    @staticmethod
    def create_user(email: str, password_hash: str, full_name: str, role: str = "user", organization: str = "General") -> Dict[str, Any]:
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        clean_email = email.lower().strip()

        # Try MongoDB Atlas First
        db = get_mongo_db()
        if db is not None:
            try:
                user_doc = {
                    "_id": user_id,
                    "email": clean_email,
                    "password_hash": password_hash,
                    "full_name": full_name,
                    "role": role,
                    "is_active": 1,
                    "organization": organization,
                    "tier": "Enterprise Pro",
                    "created_at": created_at
                }
                db.users.replace_one({"email": clean_email}, user_doc, upsert=True)
                return UserRepository.get_by_email(clean_email)
            except Exception as e:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users (id, email, password_hash, full_name, role, is_active, organization, tier, created_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, 'Enterprise Pro', ?)
            """,
            (user_id, clean_email, password_hash, full_name, role, organization, created_at)
        )
        conn.commit()
        conn.close()
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def get_by_email(email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.lower().strip()

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.users.find_one({"email": clean_email})
                if doc:
                    return mongo_doc_to_dict(doc)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (clean_email,))
        row = cursor.fetchone()
        conn.close()
        return dict_from_row(row)

    @staticmethod
    def get_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.users.find_one({"_id": user_id})
                if doc:
                    return mongo_doc_to_dict(doc)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return dict_from_row(row)

    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                docs = list(db.users.find().sort("created_at", -1))
                if docs:
                    return [mongo_doc_to_dict(d) for d in docs]
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, full_name, role, is_active, organization, tier, created_at FROM users ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]

    @staticmethod
    def update_user_status(user_id: str, is_active: bool) -> bool:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                res = db.users.update_one({"_id": user_id}, {"$set": {"is_active": 1 if is_active else 0}})
                if res.matched_count > 0:
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET is_active = ? WHERE id = ?", (1 if is_active else 0, user_id))
        conn.commit()
        affected = cursor.rowcount > 0
        conn.close()
        return affected

    @staticmethod
    def update_user_role(user_id: str, role: str) -> bool:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                res = db.users.update_one({"_id": user_id}, {"$set": {"role": role}})
                if res.matched_count > 0:
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role = ? WHERE id = ?", (role, user_id))
        conn.commit()
        affected = cursor.rowcount > 0
        conn.close()
        return affected

    @staticmethod
    def update_password(email: str, password_hash: str) -> bool:
        clean_email = email.lower().strip()

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                res = db.users.update_one({"email": clean_email}, {"$set": {"password_hash": password_hash}})
                if res.matched_count > 0:
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (password_hash, clean_email))
        conn.commit()
        affected = cursor.rowcount > 0
        conn.close()
        return affected

    @staticmethod
    def delete_user(user_id: str) -> bool:
        """
        Permanently delete user account and all associated documents, summaries, and chat history.
        Wipes records from both MongoDB Atlas and SQLite to allow immediate re-registration with the same email.
        """
        user = UserRepository.get_by_id(user_id)
        email = user.get("email", "").lower().strip() if user else None

        # 1. MongoDB Atlas Purge
        db = get_mongo_db()
        if db is not None:
            try:
                db.documents.delete_many({"user_id": user_id})
                db.summaries.delete_many({"user_id": user_id})
                db.chat_messages.delete_many({"user_id": user_id})
                db.feedback.delete_many({"user_id": user_id})
                if email:
                    db.reset_codes.delete_many({"email": email})
                    db.users.delete_many({"email": email})
                db.users.delete_one({"_id": user_id})
            except Exception:
                pass

        # 2. SQLite Database Purge
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM documents WHERE user_id = ?", (user_id,))
            cursor.execute("DELETE FROM summaries WHERE user_id = ?", (user_id,))
            cursor.execute("DELETE FROM chat_messages WHERE user_id = ?", (user_id,))
            cursor.execute("DELETE FROM feedback WHERE user_id = ?", (user_id,))
            cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
            if email:
                cursor.execute("DELETE FROM password_resets WHERE email = ?", (email,))
                cursor.execute("DELETE FROM users WHERE email = ?", (email,))
            conn.commit()
            conn.close()
        except Exception:
            pass

        return True


# ================= PASSWORD RESET REPOSITORY =================
class PasswordResetRepository:
    @staticmethod
    def create_reset_code(email: str) -> str:
        import random
        clean_email = email.lower().strip()
        code = f"{random.randint(100000, 999999)}"
        reset_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()
        expires_ts = time.time() + 1800  # 30-minute generous window

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                db.password_resets.insert_one({
                    "_id": reset_id,
                    "email": clean_email,
                    "code": code,
                    "expires_at": expires_at,
                    "expires_ts": expires_ts,
                    "used": 0,
                    "created_at": created_at
                })
                return code
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO password_resets (id, email, code, expires_at, used, created_at)
            VALUES (?, ?, ?, ?, 0, ?)
            """,
            (reset_id, clean_email, code, expires_at, created_at)
        )
        conn.commit()
        conn.close()
        return code

    @staticmethod
    @staticmethod
    def verify_and_use_code(email: str, code: str) -> bool:
        clean_email = email.lower().strip()
        clean_code = str(code).strip().replace(" ", "")
        code_candidates = [clean_code]
        if clean_code.isdigit():
            code_candidates.append(int(clean_code))

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.password_resets.find_one({
                    "email": clean_email,
                    "code": {"$in": code_candidates},
                    "used": 0
                }, sort=[("created_at", -1)])

                if doc:
                    db.password_resets.update_many({"email": clean_email}, {"$set": {"used": 1}})
                    return True
            except Exception:
                pass

        # SQLite Fallback: Fetch recent unexpired codes and compare stripped strings
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, code FROM password_resets 
            WHERE email = ? AND used = 0
            ORDER BY created_at DESC LIMIT 10
            """,
            (clean_email,)
        )
        rows = cursor.fetchall()
        for r in rows:
            stored_code = str(r["code"]).strip().replace(" ", "")
            if stored_code == clean_code:
                cursor.execute("UPDATE password_resets SET used = 1 WHERE email = ?", (clean_email,))
                conn.commit()
                conn.close()
                return True

        conn.close()
        return False


# ================= REGISTRATION OTP REPOSITORY =================
class RegistrationOTPRepository:
    @staticmethod
    def create_otp(email: str) -> str:
        import random
        clean_email = email.lower().strip()
        code = f"{random.randint(100000, 999999)}"
        otp_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()
        expires_ts = time.time() + 1800  # 30-minute generous window

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                db.registration_otps.insert_one({
                    "_id": otp_id,
                    "email": clean_email,
                    "code": code,
                    "expires_at": expires_at,
                    "expires_ts": expires_ts,
                    "used": 0,
                    "created_at": created_at
                })
                return code
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO registration_otps (id, email, code, expires_at, used, created_at)
            VALUES (?, ?, ?, ?, 0, ?)
            """,
            (otp_id, clean_email, code, expires_at, created_at)
        )
        conn.commit()
        conn.close()
        return code

    @staticmethod
    def verify_and_use_otp(email: str, code: str) -> bool:
        clean_email = email.lower().strip()
        clean_code = str(code).strip().replace(" ", "")
        code_candidates = [clean_code]
        if clean_code.isdigit():
            code_candidates.append(int(clean_code))

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.registration_otps.find_one({
                    "email": clean_email,
                    "code": {"$in": code_candidates},
                    "used": 0
                }, sort=[("created_at", -1)])

                if doc:
                    db.registration_otps.update_many({"email": clean_email}, {"$set": {"used": 1}})
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, code FROM registration_otps 
            WHERE email = ? AND used = 0
            ORDER BY created_at DESC LIMIT 10
            """,
            (clean_email,)
        )
        rows = cursor.fetchall()
        for r in rows:
            stored_code = str(r["code"]).strip().replace(" ", "")
            if stored_code == clean_code:
                cursor.execute("UPDATE registration_otps SET used = 1 WHERE email = ?", (clean_email,))
                conn.commit()
                conn.close()
                return True

        conn.close()
        return False


# ================= DOCUMENT REPOSITORY =================
class DocumentRepository:
    @staticmethod
    def create_document(user_id: str, filename: str, original_name: str, file_path: str,
                        file_type: str, file_size: int, char_count: int, word_count: int,
                        page_count: int, extracted_text: str, tags: List[str] = None) -> Dict[str, Any]:
        doc_id = str(uuid.uuid4())
        uploaded_at = datetime.utcnow().isoformat()
        tag_list = tags or ["Document", file_type.upper()]

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc_record = {
                    "_id": doc_id,
                    "user_id": user_id,
                    "filename": filename,
                    "original_name": original_name,
                    "file_path": file_path,
                    "file_type": file_type,
                    "file_size": file_size,
                    "char_count": char_count,
                    "word_count": word_count,
                    "page_count": page_count,
                    "extracted_text": extracted_text,
                    "status": "processed",
                    "tags": tag_list,
                    "uploaded_at": uploaded_at
                }
                db.documents.insert_one(doc_record)
                return DocumentRepository.get_by_id(doc_id)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO documents (id, user_id, filename, original_name, file_path, file_type,
                                   file_size, char_count, word_count, page_count, extracted_text, status, tags, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'processed', ?, ?)
            """,
            (doc_id, user_id, filename, original_name, file_path, file_type, file_size, char_count, word_count, page_count, extracted_text, json.dumps(tag_list), uploaded_at)
        )
        conn.commit()
        conn.close()
        return DocumentRepository.get_by_id(doc_id)

    @staticmethod
    def get_by_id(doc_id: str) -> Optional[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.documents.find_one({"_id": doc_id})
                if doc:
                    return mongo_doc_to_dict(doc)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
        row = cursor.fetchone()
        conn.close()
        return dict_from_row(row)

    @staticmethod
    def get_user_documents(user_id: str) -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                docs = list(db.documents.find({"user_id": user_id}).sort("uploaded_at", -1))
                if docs:
                    return [mongo_doc_to_dict(d) for d in docs]
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]

    @staticmethod
    def get_all_documents() -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                docs = list(db.documents.find().sort("uploaded_at", -1))
                results = []
                for d in docs:
                    user_doc = db.users.find_one({"_id": d.get("user_id")})
                    item = mongo_doc_to_dict(d)
                    item["user_email"] = user_doc.get("email", "") if user_doc else ""
                    item["user_name"] = user_doc.get("full_name", "") if user_doc else ""
                    results.append(item)
                if results:
                    return results
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, u.email as user_email, u.full_name as user_name
            FROM documents d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.uploaded_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]

    @staticmethod
    def delete_document(doc_id: str, user_id: Optional[str] = None) -> bool:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                filter_q = {"doc_id": doc_id}
                doc_q = {"_id": doc_id}
                if user_id:
                    filter_q["user_id"] = user_id
                    doc_q["user_id"] = user_id

                db.summaries.delete_many(filter_q)
                db.chat_messages.delete_many(filter_q)
                res = db.documents.delete_one(doc_q)
                if res.deleted_count > 0:
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("DELETE FROM summaries WHERE doc_id = ? AND user_id = ?", (doc_id, user_id))
            cursor.execute("DELETE FROM chat_messages WHERE doc_id = ? AND user_id = ?", (doc_id, user_id))
            cursor.execute("DELETE FROM documents WHERE id = ? AND user_id = ?", (doc_id, user_id))
        else:
            cursor.execute("DELETE FROM summaries WHERE doc_id = ?", (doc_id,))
            cursor.execute("DELETE FROM chat_messages WHERE doc_id = ?", (doc_id,))
            cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        conn.commit()
        affected = cursor.rowcount > 0
        conn.close()
        return affected


# ================= SUMMARY REPOSITORY =================
class SummaryRepository:
    @staticmethod
    def save_summary(doc_id: str, user_id: str, summary_type: str, length_type: str,
                     executive_summary: str, bullet_points: List[str], key_takeaways: List[str],
                     entities: List[str] = None, confidence_score: float = 0.95,
                     compression_ratio: float = 0.25, reading_time_saved_min: float = 5.0,
                     model_used: str = "Hybrid-TextRank-T5", language: str = "en") -> Dict[str, Any]:
        summary_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        lang = language.lower().strip() if language else "en"

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                summary_record = {
                    "_id": summary_id,
                    "doc_id": doc_id,
                    "user_id": user_id,
                    "summary_type": summary_type,
                    "length_type": length_type,
                    "language": lang,
                    "executive_summary": executive_summary,
                    "bullet_points": bullet_points,
                    "key_takeaways": key_takeaways,
                    "entities": entities or [],
                    "confidence_score": confidence_score,
                    "compression_ratio": compression_ratio,
                    "reading_time_saved_min": reading_time_saved_min,
                    "model_used": model_used,
                    "created_at": created_at
                }
                db.summaries.insert_one(summary_record)
                return SummaryRepository.get_by_id(summary_id)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO summaries (id, doc_id, user_id, summary_type, length_type, executive_summary,
                                   bullet_points, key_takeaways, entities, confidence_score,
                                   compression_ratio, reading_time_saved_min, model_used, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (summary_id, doc_id, user_id, summary_type, length_type, executive_summary,
             json.dumps(bullet_points), json.dumps(key_takeaways), json.dumps(entities or []),
             confidence_score, compression_ratio, reading_time_saved_min, model_used, created_at)
        )
        conn.commit()
        conn.close()
        return SummaryRepository.get_by_id(summary_id)

    @staticmethod
    def get_by_id(summary_id: str) -> Optional[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db.summaries.find_one({"_id": summary_id})
                if doc:
                    return mongo_doc_to_dict(doc)
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM summaries WHERE id = ?", (summary_id,))
        row = cursor.fetchone()
        conn.close()
        return dict_from_row(row)

    @staticmethod
    def get_by_doc_id(doc_id: str, language: Optional[str] = None) -> Optional[Dict[str, Any]]:
        target_lang = language.lower().strip() if language else None

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                query = {"doc_id": doc_id}
                if target_lang:
                    query["language"] = target_lang
                doc = db.summaries.find_one(query, sort=[("created_at", -1)])
                if doc:
                    return mongo_doc_to_dict(doc)
                if target_lang:
                    # Explicit language requested but not found in Atlas
                    return None
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM summaries WHERE doc_id = ? ORDER BY created_at DESC LIMIT 1", (doc_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        res = dict_from_row(row)
        if target_lang and res.get("language") != target_lang:
            return None
        return res

    @staticmethod
    def get_user_summaries(user_id: str) -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                summaries = list(db.summaries.find({"user_id": user_id}).sort("created_at", -1))
                results = []
                for s in summaries:
                    item = mongo_doc_to_dict(s)
                    d = db.documents.find_one({"_id": s.get("doc_id")})
                    item["original_name"] = d.get("original_name", "") if d else ""
                    item["file_type"] = d.get("file_type", "") if d else ""
                    item["word_count"] = d.get("word_count", 0) if d else 0
                    results.append(item)
                if results:
                    return results
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.*, d.original_name, d.file_type, d.word_count
            FROM summaries s
            JOIN documents d ON s.doc_id = d.id
            WHERE s.user_id = ?
            ORDER BY s.created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]


# ================= CHAT REPOSITORY =================
class ChatRepository:
    @staticmethod
    def add_message(doc_id: str, user_id: str, sender: str, message: str,
                    citations: List[Dict[str, Any]] = None, confidence_score: float = 0.92,
                    latency_ms: float = 120.0) -> Dict[str, Any]:
        msg_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                msg_record = {
                    "_id": msg_id,
                    "doc_id": doc_id,
                    "user_id": user_id,
                    "sender": sender,
                    "message": message,
                    "citations": citations or [],
                    "confidence_score": confidence_score,
                    "latency_ms": latency_ms,
                    "created_at": created_at
                }
                db.chat_messages.insert_one(msg_record)
                return {
                    "id": msg_id,
                    "doc_id": doc_id,
                    "user_id": user_id,
                    "sender": sender,
                    "message": message,
                    "citations": citations or [],
                    "confidence_score": confidence_score,
                    "latency_ms": latency_ms,
                    "created_at": created_at
                }
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO chat_messages (id, doc_id, user_id, sender, message, citations, confidence_score, latency_ms, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (msg_id, doc_id, user_id, sender, message, json.dumps(citations or []), confidence_score, latency_ms, created_at)
        )
        conn.commit()
        conn.close()
        return {
            "id": msg_id,
            "doc_id": doc_id,
            "user_id": user_id,
            "sender": sender,
            "message": message,
            "citations": citations or [],
            "confidence_score": confidence_score,
            "latency_ms": latency_ms,
            "created_at": created_at
        }

    @staticmethod
    def get_doc_messages(doc_id: str, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                filter_q = {"doc_id": doc_id}
                if user_id:
                    filter_q["user_id"] = user_id
                docs = list(db.chat_messages.find(filter_q).sort("created_at", 1))
                if docs:
                    return [mongo_doc_to_dict(d) for d in docs]
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT * FROM chat_messages WHERE doc_id = ? AND user_id = ? ORDER BY created_at ASC", (doc_id, user_id))
        else:
            cursor.execute("SELECT * FROM chat_messages WHERE doc_id = ? ORDER BY created_at ASC", (doc_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]

    @staticmethod
    def get_user_history(user_id: str) -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                messages = list(db.chat_messages.find({"user_id": user_id}).sort("created_at", -1).limit(50))
                results = []
                for m in messages:
                    item = mongo_doc_to_dict(m)
                    d = db.documents.find_one({"_id": m.get("doc_id")})
                    item["original_name"] = d.get("original_name", "") if d else ""
                    results.append(item)
                if results:
                    return results
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.*, d.original_name
            FROM chat_messages c
            JOIN documents d ON c.doc_id = d.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
            LIMIT 50
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]


# ================= FEEDBACK REPOSITORY =================
class FeedbackRepository:
    @staticmethod
    def create_feedback(user_id: str, user_email: str, doc_id: Optional[str], rating: int, category: str, message: str) -> Dict[str, Any]:
        feedback_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                feedback_doc = {
                    "_id": feedback_id,
                    "user_id": user_id,
                    "user_email": user_email,
                    "doc_id": doc_id,
                    "rating": rating,
                    "category": category,
                    "message": message,
                    "status": "pending",
                    "created_at": created_at
                }
                db.feedback.insert_one(feedback_doc)
                return {
                    "id": feedback_id,
                    "user_id": user_id,
                    "user_email": user_email,
                    "doc_id": doc_id,
                    "rating": rating,
                    "category": category,
                    "message": message,
                    "status": "pending",
                    "created_at": created_at
                }
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO feedback (id, user_id, user_email, doc_id, rating, category, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
            """,
            (feedback_id, user_id, user_email, doc_id, rating, category, message, created_at)
        )
        conn.commit()
        conn.close()
        return {
            "id": feedback_id,
            "user_id": user_id,
            "user_email": user_email,
            "doc_id": doc_id,
            "rating": rating,
            "category": category,
            "message": message,
            "status": "pending",
            "created_at": created_at
        }

    @staticmethod
    def get_all_feedback() -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                docs = list(db.feedback.find().sort("created_at", -1))
                if docs:
                    return [mongo_doc_to_dict(d) for d in docs]
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]

    @staticmethod
    def update_status(feedback_id: str, status: str) -> bool:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                res = db.feedback.update_one({"_id": feedback_id}, {"$set": {"status": status}})
                if res.matched_count > 0:
                    return True
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE feedback SET status = ? WHERE id = ?", (status, feedback_id))
        conn.commit()
        affected = cursor.rowcount > 0
        conn.close()
        return affected


# ================= SYSTEM LOGS / TELEMETRY =================
class SystemLogRepository:
    @staticmethod
    def log_event(level: str, module: str, message: str, latency_ms: float = 0.0, memory_mb: float = 0.0) -> None:
        log_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()

        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                db.system_logs.insert_one({
                    "_id": log_id,
                    "level": level,
                    "module": module,
                    "message": message,
                    "latency_ms": latency_ms,
                    "memory_mb": memory_mb,
                    "created_at": created_at
                })
                return
            except Exception:
                pass

        # SQLite Fallback
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO system_logs (id, level, module, message, latency_ms, memory_mb, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (log_id, level, module, message, latency_ms, memory_mb, created_at)
            )
            conn.commit()
            conn.close()
        except Exception:
            pass

    @staticmethod
    def get_recent_logs(limit: int = 50) -> List[Dict[str, Any]]:
        # Try MongoDB Atlas
        db = get_mongo_db()
        if db is not None:
            try:
                docs = list(db.system_logs.find().sort("created_at", -1).limit(limit))
                if docs:
                    return [mongo_doc_to_dict(d) for d in docs]
            except Exception:
                pass

        # SQLite Fallback
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM system_logs ORDER BY created_at DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict_from_row(r) for r in rows]
