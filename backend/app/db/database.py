import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.config import DB_PATH

logger = logging.getLogger(__name__)

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        is_active INTEGER DEFAULT 1,
        organization TEXT DEFAULT 'General',
        tier TEXT DEFAULT 'Pro',
        created_at TEXT NOT NULL
    )
    """)

    # Documents Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER DEFAULT 0,
        char_count INTEGER DEFAULT 0,
        word_count INTEGER DEFAULT 0,
        page_count INTEGER DEFAULT 1,
        extracted_text TEXT NOT NULL,
        status TEXT DEFAULT 'processed',
        tags TEXT DEFAULT '[]',
        uploaded_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Summaries Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS summaries (
        id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        summary_type TEXT NOT NULL,
        length_type TEXT NOT NULL,
        executive_summary TEXT NOT NULL,
        bullet_points TEXT NOT NULL,
        key_takeaways TEXT NOT NULL,
        entities TEXT DEFAULT '[]',
        confidence_score REAL DEFAULT 0.95,
        compression_ratio REAL DEFAULT 0.25,
        reading_time_saved_min REAL DEFAULT 5.0,
        model_used TEXT DEFAULT 'Hybrid-TextRank-T5',
        created_at TEXT NOT NULL,
        FOREIGN KEY(doc_id) REFERENCES documents(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Chat Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        message TEXT NOT NULL,
        citations TEXT DEFAULT '[]',
        confidence_score REAL DEFAULT 0.92,
        latency_ms REAL DEFAULT 150.0,
        created_at TEXT NOT NULL,
        FOREIGN KEY(doc_id) REFERENCES documents(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Feedback Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        doc_id TEXT,
        rating INTEGER NOT NULL,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL
    )
    """)

    # System Logs / AI Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_logs (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        module TEXT NOT NULL,
        message TEXT NOT NULL,
        latency_ms REAL DEFAULT 0.0,
        memory_mb REAL DEFAULT 0.0,
        created_at TEXT NOT NULL
    )
    """)

    # Password Resets (OTP Verification Codes)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Registration OTP Verification Codes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS registration_otps (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()
    logger.info("Database initialized successfully.")
