import logging
from typing import Optional
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.database import Database
from app.core.config import MONGODB_URI, MONGODB_DB_NAME

logger = logging.getLogger(__name__)

_mongo_client: Optional[MongoClient] = None
_mongo_db: Optional[Database] = None
_mongo_attempted: bool = False

def get_mongo_client() -> Optional[MongoClient]:
    """Get or initialize singleton PyMongo MongoClient with non-blocking cached state."""
    global _mongo_client, _mongo_attempted
    if _mongo_client is not None:
        return _mongo_client

    if _mongo_attempted:
        return None

    if not MONGODB_URI:
        _mongo_attempted = True
        return None

    _mongo_attempted = True
    try:
        import certifi
        client = MongoClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=1500,
            connectTimeoutMS=1500,
            socketTimeoutMS=1500,
            maxPoolSize=20,
            minPoolSize=1
        )
        client.admin.command('ping')
        _mongo_client = client
        logger.info(f"Successfully connected to MongoDB Atlas database: {MONGODB_DB_NAME}")
        return _mongo_client
    except Exception as e:
        logger.warning(f"MongoDB Atlas connection not available ({e}). Using ultra-fast SQLite engine.")
        _mongo_client = None
        return None

def get_mongo_db() -> Optional[Database]:
    """Get the active MongoDB database object."""
    global _mongo_db
    if _mongo_db is not None:
        return _mongo_db

    client = get_mongo_client()
    if client is not None:
        _mongo_db = client[MONGODB_DB_NAME]
        return _mongo_db
    return None

def is_mongo_connected() -> bool:
    """Check if MongoDB Atlas is currently connected and reachable."""
    db = get_mongo_db()
    if db is None:
        return False
    try:
        db.client.admin.command('ping')
        return True
    except Exception:
        return False

def init_mongo_indexes():
    """Create essential performance and unique indexes on MongoDB collections."""
    db = get_mongo_db()
    if db is None:
        return

    try:
        # Users Collection: Unique Email Index
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.users.create_index([("created_at", DESCENDING)])

        # Documents Collection: user_id & uploaded_at
        db.documents.create_index([("user_id", ASCENDING)])
        db.documents.create_index([("uploaded_at", DESCENDING)])

        # Summaries Collection: doc_id & user_id
        db.summaries.create_index([("doc_id", ASCENDING)])
        db.summaries.create_index([("user_id", ASCENDING)])

        # Chat Messages: doc_id, user_id & created_at
        db.chat_messages.create_index([("doc_id", ASCENDING)])
        db.chat_messages.create_index([("user_id", ASCENDING)])
        db.chat_messages.create_index([("created_at", ASCENDING)])

        # Password Resets: email & code
        db.password_resets.create_index([("email", ASCENDING), ("code", ASCENDING)])
        db.password_resets.create_index([("expires_at", ASCENDING)])

        # Registration OTPs: email & code
        db.registration_otps.create_index([("email", ASCENDING), ("code", ASCENDING)])
        db.registration_otps.create_index([("expires_at", ASCENDING)])

        # System Logs & Feedback
        db.system_logs.create_index([("created_at", DESCENDING)])
        db.feedback.create_index([("created_at", DESCENDING)])

        logger.info("MongoDB Atlas indexes initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating MongoDB indexes: {e}")
