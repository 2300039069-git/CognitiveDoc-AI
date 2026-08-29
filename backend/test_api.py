import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_full_system():
    print("==================================================")
    print("STARTING COGNITIVEDOC SYSTEM ENDPOINT VERIFICATION")
    print("==================================================")

    # 1. Health Check
    res = requests.get("http://127.0.0.1:8000/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[OK] Health Check: OK ->", res.json())

    # 2. Login User Demo
    user_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "user@example.com",
        "password": "user123"
    })
    assert user_login.status_code == 200, f"User login failed: {user_login.text}"
    user_token = user_login.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}
    print("[OK] User Demo Login: OK ->", user_login.json()["user"]["email"])

    # 3. Login Admin Demo
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[OK] Admin Demo Login: OK ->", admin_login.json()["user"]["email"])

    # 4. User Profile
    me = requests.get(f"{BASE_URL}/auth/me", headers=user_headers)
    assert me.status_code == 200
    print("[OK] User Profile Me: OK ->", me.json()["full_name"])

    # 5. List Documents
    docs_res = requests.get(f"{BASE_URL}/documents", headers=user_headers)
    assert docs_res.status_code == 200
    docs = docs_res.json()
    print(f"[OK] List Documents: OK -> Found {len(docs)} documents")
    assert len(docs) > 0, "Expected pre-seeded documents"
    test_doc = docs[0]
    doc_id = test_doc["id"]

    # 6. Upload a New Sample Document
    sample_text = """ARTIFICIAL INTELLIGENCE RESEARCH DISCLOSURE (2026)

This document specifies the algorithmic parameters for high-speed local inference.
1. Privacy Mandate: All operations must execute strictly on-device with zero cloud egress.
2. Latency Threshold: Extractive summaries must complete within 200ms and RAG retrieval within 50ms.
3. Accuracy: Grounded citations must reference exact paragraph and chunk IDs for all synthesized answers.
"""
    upload_res = requests.post(
        f"{BASE_URL}/documents/upload",
        files={"file": ("AI_Research_Disclosure_2026.txt", sample_text.encode("utf-8"), "text/plain")},
        data={"tags": "Research,AI,Local"},
        headers=user_headers
    )
    assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
    new_doc_id = upload_res.json()["document"]["id"]
    print("[OK] Document Upload: OK -> Uploaded ID:", new_doc_id)

    # 7. Generate Abstractive & Extractive Summaries
    sum_res = requests.post(f"{BASE_URL}/ai/summarize", json={
        "doc_id": new_doc_id,
        "summary_type": "abstractive",
        "length_type": "medium"
    }, headers=user_headers)
    assert sum_res.status_code == 200, f"Summarize failed: {sum_res.text}"
    summary = sum_res.json()["summary"]
    print("[OK] AI Summarization: OK ->", summary["model_used"], f"({sum_res.json()['metrics']['latency_ms']}ms)")
    print("   Executive Summary:", summary["executive_summary"][:120], "...")

    # 8. RAG Semantic Q&A Chat with Citations
    chat_res = requests.post(f"{BASE_URL}/ai/chat", json={
        "doc_id": new_doc_id,
        "question": "What is the privacy mandate and latency threshold?"
    }, headers=user_headers)
    assert chat_res.status_code == 200, f"Chat failed: {chat_res.text}"
    ans_msg = chat_res.json()["message"]
    print("[OK] RAG Semantic Q&A: OK ->")
    print("   Answer:", ans_msg["message"][:140], "...")
    print(f"   Citations Returned: {len(ans_msg['citations'])}, Confidence: {ans_msg['confidence_score'] * 100}%")

    # 9. Process Status
    status_res = requests.get(f"{BASE_URL}/ai/process-status/{new_doc_id}", headers=user_headers)
    assert status_res.status_code == 200
    print("[OK] AI Process Status: OK ->", status_res.json()["status"])

    # 10. Analytics
    user_analytics = requests.get(f"{BASE_URL}/analytics/user", headers=user_headers)
    assert user_analytics.status_code == 200
    print(f"[OK] User Analytics: OK -> Time Saved: {user_analytics.json()['time_saved_minutes']} mins")

    admin_analytics = requests.get(f"{BASE_URL}/analytics/admin", headers=admin_headers)
    assert admin_analytics.status_code == 200
    print("[OK] Admin Analytics: OK -> Formats Tracked:", len(admin_analytics.json()["format_distribution"]))

    # 11. Admin Endpoints
    admin_stats = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers)
    assert admin_stats.status_code == 200
    print("[OK] Admin Stats: OK -> Users:", admin_stats.json()["total_users"], "Docs:", admin_stats.json()["total_documents"])

    admin_users = requests.get(f"{BASE_URL}/admin/users", headers=admin_headers)
    assert admin_users.status_code == 200
    print(f"[OK] Admin Users: OK -> Found {len(admin_users.json())} users")

    admin_telemetry = requests.get(f"{BASE_URL}/admin/ai-monitoring", headers=admin_headers)
    assert admin_telemetry.status_code == 200
    print("[OK] Admin AI Monitoring: OK -> Engine Status:", admin_telemetry.json()["model_status"]["summarizer"])

    # 12. Submit & Review Feedback
    fb_res = requests.post(f"{BASE_URL}/admin/feedback", json={
        "doc_id": new_doc_id,
        "rating": 5,
        "category": "Summarization Quality",
        "message": "Automated test feedback verification."
    }, headers=user_headers)
    assert fb_res.status_code == 200
    print("[OK] Submit Feedback: OK")

    fb_list = requests.get(f"{BASE_URL}/admin/feedback", headers=admin_headers)
    assert fb_list.status_code == 200
    print(f"[OK] Admin Feedback List: OK -> {len(fb_list.json())} feedback items")

    print("\n==================================================")
    print("ALL API ENDPOINTS & AI CAPABILITIES FULLY VERIFIED!")
    print("==================================================")

if __name__ == "__main__":
    test_full_system()
