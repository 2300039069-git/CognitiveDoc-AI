import os
import json
from app.db.database import init_db, get_db_connection
from app.core.security import hash_password
from app.db.models import (
    UserRepository, DocumentRepository, SummaryRepository,
    ChatRepository, FeedbackRepository, SystemLogRepository
)
from app.services.nlp_engine import generate_summary

from app.db.mongodb import init_mongo_indexes, is_mongo_connected

def seed_database():
    init_db()
    if is_mongo_connected():
        init_mongo_indexes()

    # 1. Seed Master Super Admin
    master_admin = UserRepository.get_by_email("kancharladhanush2003@gmail.com")
    if not master_admin:
        master_admin = UserRepository.create_user(
            email="kancharladhanush2003@gmail.com",
            password_hash=hash_password("Kdk2003"),
            full_name="Master Administrator (Dhanush)",
            role="admin",
            organization="Cognitive Enterprise Headquarters"
        )
        print("Created master admin user: kancharladhanush2003@gmail.com / Kdk2003")

    # Seed demo admin
    admin_user = UserRepository.get_by_email("admin@example.com")
    if not admin_user:
        admin_user = UserRepository.create_user(
            email="admin@example.com",
            password_hash=hash_password("admin123"),
            full_name="System Administrator",
            role="admin",
            organization="Cognitive Enterprise Core"
        )
        print("Created admin user: admin@example.com / admin123")

    normal_user = UserRepository.get_by_email("user@example.com")
    if not normal_user:
        normal_user = UserRepository.create_user(
            email="user@example.com",
            password_hash=hash_password("user123"),
            full_name="Sarah Jenkins",
            role="user",
            organization="Apex Global Analytics"
        )
        print("Created standard user: user@example.com / user123")

    # 2. Seed Sample Documents if none exist
    user_docs = DocumentRepository.get_user_documents(normal_user["id"])
    if not user_docs:
        # Sample Doc 1: Legal MSA
        doc1_text = """MASTER SERVICES AND ARTIFICIAL INTELLIGENCE LICENSE AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of January 15, 2026, by and between Apex Global Analytics, Inc. ("Client"), a Delaware corporation, and Cognitive Enterprise Systems, LLC ("Provider").

1. SCOPE OF SERVICES
Provider agrees to deliver enterprise natural language processing, automated document summarization, and vector-grounded retrieval systems as detailed in Statement of Work #4. The system operates on dedicated local hardware with zero external third-party data egress, ensuring full compliance with GDPR and HIPAA data handling guidelines.

2. SERVICE LEVEL COMMITMENTS & LATENCY
Provider guarantees a 99.95% system uptime across all standard billing cycles. Automated extractive and abstractive summarization requests under 50,000 words must achieve inference completion within 3.5 seconds. RAG semantic queries must return source citations with at least 85% contextual confidence within 400 milliseconds.

3. INTELLECTUAL PROPERTY & DATA PRIVACY
All customer data, ingested proprietary documents, embeddings, and derived summaries remain the exclusive intellectual property of the Client. Provider retains no perpetual training rights over Client confidential materials. Provider shall maintain AES-256 encryption at rest and TLS 1.3 in transit for all communications.

4. TERM AND TERMINATION
This Agreement shall remain in effect for an initial duration of 24 months. Either party may terminate this Agreement upon 30 days prior written notice in the event of a material breach that remains uncured after 15 calendar days.

5. LIABILITY AND INDEMNIFICATION
Provider's total aggregate liability arising under this Agreement shall be limited to the total fees paid by Client during the preceding twelve (12) month period. Provider agrees to indemnify Client against third-party intellectual property infringement claims arising directly from Provider's proprietary software models."""

        d1 = DocumentRepository.create_document(
            user_id=normal_user["id"],
            filename="Enterprise_AI_Master_Services_Agreement.pdf",
            original_name="Enterprise_AI_Master_Services_Agreement.pdf",
            file_path="uploads/Enterprise_AI_Master_Services_Agreement.pdf",
            file_type="pdf",
            file_size=184500,
            char_count=len(doc1_text),
            word_count=len(doc1_text.split()),
            page_count=3,
            extracted_text=doc1_text,
            tags=["Legal", "Contract", "SLA", "Compliance"]
        )

        s1 = generate_summary(doc1_text, "abstractive", "medium")
        SummaryRepository.save_summary(
            doc_id=d1["id"],
            user_id=normal_user["id"],
            summary_type=s1["summary_type"],
            length_type=s1["length_type"],
            executive_summary=s1["executive_summary"],
            bullet_points=s1["bullet_points"],
            key_takeaways=s1["key_takeaways"],
            entities=s1["entities"],
            confidence_score=0.96,
            compression_ratio=s1["compression_ratio"],
            reading_time_saved_min=s1["reading_time_saved_min"],
            model_used=s1["model_used"]
        )

        ChatRepository.add_message(
            doc_id=d1["id"],
            user_id=normal_user["id"],
            sender="user",
            message="What is the guaranteed system uptime and summarization latency?"
        )
        ChatRepository.add_message(
            doc_id=d1["id"],
            user_id=normal_user["id"],
            sender="assistant",
            message="According to Section 2 (Service Level Commitments), the Provider guarantees a 99.95% system uptime across all billing cycles. Summarization requests under 50,000 words must complete within 3.5 seconds, while RAG semantic queries must return within 400ms with >=85% confidence.",
            citations=[{
                "chunk_id": 1,
                "page_number": 1,
                "relevance_percent": 97,
                "snippet": "Provider guarantees a 99.95% system uptime across all standard billing cycles. Automated extractive and abstractive summarization requests under 50,000 words must achieve inference completion within 3.5 seconds."
            }],
            confidence_score=0.97,
            latency_ms=118.4
        )

        # Sample Doc 2: Medical / Healthcare
        doc2_text = """CLINICAL TRIAL EVALUATION: NEURO-SYNAPSE TARGETED THERAPEUTIC REGIMEN (PHASE IIB)

Abstract:
This clinical investigation evaluates the therapeutic efficacy, neuro-protective biomarkers, and tolerability profile of compound NST-409 in 420 adult patients diagnosed with early-stage cognitive impairment.

Methodology:
Subjects received either oral NST-409 (50mg twice daily) or placebo over a randomized 24-week double-blind period. Primary endpoints included changes in the Alzheimer's Disease Assessment Scale–Cognitive Subscale (ADAS-Cog13) and cerebrospinal fluid (CSF) p-tau217 concentration levels.

Key Clinical Findings:
1. Cognitive Stabilization: Patients in the active cohort demonstrated a statistically significant 34.2% reduction in cognitive decline progression compared to the control group (p < 0.001).
2. Biomarker Modulation: Baseline CSF p-tau217 concentrations decreased by an average of 22.8% at week 24, indicating robust down-regulation of neuro-fibrillary pathology.
3. Safety & Tolerability: Treatment-emergent adverse events (TEAEs) were mild to moderate, primarily consisting of transient nausea (8.4%) and mild headache (6.1%). No incidence of amyloid-related imaging abnormalities (ARIA) was detected on serial MRI scans.

Conclusion & Recommendations:
The Phase IIb outcomes substantiate the disease-modifying potential of NST-409. Progression to Phase III multi-center trials is strongly recommended with dosage maintained at 50mg BID."""

        d2 = DocumentRepository.create_document(
            user_id=normal_user["id"],
            filename="Clinical_Trials_NeuroTech_Report_2026.docx",
            original_name="Clinical_Trials_NeuroTech_Report_2026.docx",
            file_path="uploads/Clinical_Trials_NeuroTech_Report_2026.docx",
            file_type="docx",
            file_size=245000,
            char_count=len(doc2_text),
            word_count=len(doc2_text.split()),
            page_count=2,
            extracted_text=doc2_text,
            tags=["Healthcare", "Clinical Trial", "Biotech", "Research"]
        )

        s2 = generate_summary(doc2_text, "extractive", "detailed")
        SummaryRepository.save_summary(
            doc_id=d2["id"],
            user_id=normal_user["id"],
            summary_type=s2["summary_type"],
            length_type=s2["length_type"],
            executive_summary=s2["executive_summary"],
            bullet_points=s2["bullet_points"],
            key_takeaways=s2["key_takeaways"],
            entities=s2["entities"],
            confidence_score=0.98,
            compression_ratio=s2["compression_ratio"],
            reading_time_saved_min=s2["reading_time_saved_min"],
            model_used=s2["model_used"]
        )

        # Sample Doc 3: Financial Earnings
        doc3_text = """Q2 FINANCIAL PERFORMANCE AND ANNUAL REVISED GUIDANCE REPORT

Executive Overview:
For the second quarter of fiscal year 2026, total consolidated revenue reached $148.6 million, representing a 28.4% year-over-year expansion driven primarily by enterprise adoption of our on-premise AI Intelligence platform.

Financial Highlights:
- Subscription Recurring Revenue (ARR): Reached $112.4M, growing 34% YoY with a net revenue retention rate of 124%.
- Operating Margin: Expanded by 420 basis points to 22.8%, attributable to infrastructure optimizations and local edge model inference efficiencies.
- Net Income & Cash Flow: GAAP Net Income was $24.1 million. Operating cash flow totaled $38.9 million, maintaining a total cash balance of $215.0 million with zero funded debt.
- Segment Performance: North America represented 62% of revenue, EMEA 26%, and APAC 12%. Enterprise customer count with ARR exceeding $100k expanded to 418 accounts.

Fiscal 2026 Full-Year Guidance:
Due to strong pipeline visibility and contracted enterprise expansions, management increases full-year 2026 revenue guidance to $595M-$610M (prior guidance: $565M-$580M), representing 26% YoY growth."""

        d3 = DocumentRepository.create_document(
            user_id=normal_user["id"],
            filename="Q2_Financial_Performance_and_Forecast.txt",
            original_name="Q2_Financial_Performance_and_Forecast.txt",
            file_path="uploads/Q2_Financial_Performance_and_Forecast.txt",
            file_type="txt",
            file_size=98000,
            char_count=len(doc3_text),
            word_count=len(doc3_text.split()),
            page_count=1,
            extracted_text=doc3_text,
            tags=["Finance", "Earnings", "Q2-2026", "Guidance"]
        )

        s3 = generate_summary(doc3_text, "abstractive", "short")
        SummaryRepository.save_summary(
            doc_id=d3["id"],
            user_id=normal_user["id"],
            summary_type=s3["summary_type"],
            length_type=s3["length_type"],
            executive_summary=s3["executive_summary"],
            bullet_points=s3["bullet_points"],
            key_takeaways=s3["key_takeaways"],
            entities=s3["entities"],
            confidence_score=0.97,
            compression_ratio=s3["compression_ratio"],
            reading_time_saved_min=s3["reading_time_saved_min"],
            model_used=s3["model_used"]
        )

        # 3. Seed Feedback
        FeedbackRepository.create_feedback(
            user_id=normal_user["id"],
            user_email=normal_user["email"],
            doc_id=d1["id"],
            rating=5,
            category="Accuracy",
            message="The extractive bullet points accurately captured all key SLA liability thresholds without hallucinations."
        )
        FeedbackRepository.create_feedback(
            user_id=normal_user["id"],
            user_email=normal_user["email"],
            doc_id=d2["id"],
            rating=5,
            category="Performance",
            message="RAG citation snippet highlighting is remarkably fast and provides pinpoint page numbers."
        )

        # 4. Seed Telemetry Logs
        SystemLogRepository.log_event("INFO", "AI_ENGINE", "Model weights warm-up completed in 42ms", latency_ms=42.0, memory_mb=210.5)
        SystemLogRepository.log_event("INFO", "VECTOR_STORE", "Vector chunk index built for document d1", latency_ms=18.5, memory_mb=215.2)
        SystemLogRepository.log_event("INFO", "SUMMARIZER", "Abstractive summary generated for doc d1", latency_ms=145.0, memory_mb=220.0)

        print("Seeded sample enterprise documents, summaries, chats, feedback, and telemetry logs.")

if __name__ == "__main__":
    seed_database()
