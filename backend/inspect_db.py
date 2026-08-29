import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "app_data.db"

def inspect_database():
    if not DB_PATH.exists():
        print(f"[!] Database file not found at: {DB_PATH}")
        return

    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Ensure demo users are active
    cursor.execute("UPDATE users SET is_active = 1 WHERE is_active = 0")
    conn.commit()

    print("=" * 75)
    print(f" COGNITIVEDOC DATABASE INSPECTION REPORT: {DB_PATH.name}")
    print("=" * 75)

    # 1. USERS
    cursor.execute("SELECT id, email, full_name, role, is_active, organization, tier, created_at FROM users")
    users = cursor.fetchall()
    print(f"\n[1] USERS TABLE ({len(users)} records):")
    print("-" * 75)
    for u in users:
        print(f" * ID: {u['id'][:8]}... | Name: {u['full_name']:<20} | Email: {u['email']:<28} | Role: {u['role']:<6} | Active: {bool(u['is_active'])}")

    # 2. DOCUMENTS
    cursor.execute("SELECT id, original_name, file_type, file_size, word_count, page_count, uploaded_at FROM documents")
    docs = cursor.fetchall()
    print(f"\n[2] DOCUMENTS TABLE ({len(docs)} records):")
    print("-" * 75)
    for d in docs:
        size_kb = round(d['file_size'] / 1024, 1)
        print(f" * ID: {d['id'][:8]}... | {d['original_name']:<44} | {d['file_type'].upper():<4} | {d['word_count']:>5} words | {size_kb:>5} KB")

    # 3. SUMMARIES
    cursor.execute("SELECT id, doc_id, summary_type, length_type, confidence_score, reading_time_saved_min, model_used FROM summaries")
    summaries = cursor.fetchall()
    print(f"\n[3] SUMMARIES TABLE ({len(summaries)} records):")
    print("-" * 75)
    for s in summaries:
        conf = round(s['confidence_score'] * 100)
        print(f" * Doc: {s['doc_id'][:8]}... | Type: {s['summary_type']:<11} | Length: {s['length_type']:<8} | Conf: {conf}% | Saved: {s['reading_time_saved_min']}m | Model: {s['model_used']}")

    # 4. CHAT MESSAGES
    cursor.execute("SELECT id, doc_id, sender, message, latency_ms FROM chat_messages ORDER BY created_at DESC LIMIT 6")
    chats = cursor.fetchall()
    print(f"\n[4] RECENT CHAT MESSAGES ({len(chats)} shown):")
    print("-" * 75)
    for c in chats:
        snippet = c['message'][:55] + ("..." if len(c['message']) > 55 else "")
        print(f" * [{c['sender'].upper():<9}] Doc: {c['doc_id'][:8]}... | Latency: {c['latency_ms']}ms | \"{snippet}\"")

    # 5. FEEDBACK
    cursor.execute("SELECT id, user_email, rating, category, message, status FROM feedback")
    feedback = cursor.fetchall()
    print(f"\n[5] USER FEEDBACK TABLE ({len(feedback)} records):")
    print("-" * 75)
    for f in feedback:
        stars = f"{f['rating']}/5 Stars"
        print(f" * From: {f['user_email']:<28} | Rating: {stars:<11} | Category: {f['category']:<22} | Status: {f['status']}")

    # 6. SYSTEM LOGS
    cursor.execute("SELECT COUNT(*) FROM system_logs")
    log_count = cursor.fetchone()[0]
    print(f"\n[6] SYSTEM TELEMETRY LOGS ({log_count} total events recorded)")

    print("\n" + "=" * 75)
    conn.close()

if __name__ == "__main__":
    inspect_database()
