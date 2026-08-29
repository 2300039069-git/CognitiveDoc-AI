from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.db.seed import seed_database
from app.api import auth, documents, ai, admin, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database & seed demo accounts
    init_db()
    seed_database()
    yield

app = FastAPI(
    title="CognitiveDoc Enterprise AI API",
    description="Enterprise-Grade AI-Based Document Summarization & RAG Q&A System",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "CognitiveDoc.AI Enterprise API is running successfully!",
        "version": "2.0.0",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "frontend_url": "http://localhost:5173",
        "endpoints": {
            "auth": "/api/auth",
            "documents": "/api/documents",
            "ai": "/api/ai",
            "admin": "/api/admin",
            "analytics": "/api/analytics"
        }
    }

@app.get("/users")
@app.get("/api/users")
def get_all_registered_users():
    """Directly view all registered users from the database."""
    from app.db.models import UserRepository
    users = UserRepository.get_all_users()
    return [
        {
            "id": u["id"],
            "full_name": u["full_name"],
            "email": u["email"],
            "role": u["role"],
            "is_active": bool(u["is_active"]),
            "organization": u["organization"],
            "registered_date": u["created_at"]
        }
        for u in users
    ]

from fastapi.responses import HTMLResponse

@app.get("/backend-users", response_class=HTMLResponse)
def view_backend_users_html():
    """Visual HTML table of all registered users on backend."""
    from app.db.models import UserRepository
    from app.db.mongodb import is_mongo_connected
    users = UserRepository.get_all_users()
    db_engine = "MongoDB Atlas (NoSQL Cloud)" if is_mongo_connected() else "SQLite 3 (Local Embedded)"
    db_badge_color = "#10b981" if is_mongo_connected() else "#38bdf8"
    
    rows = ""
    for u in users:
        role_color = "#f59e0b" if u["role"] == "admin" else "#38bdf8"
        status_badge = '<span style="color: #4ade80; background: rgba(74,222,128,0.1); padding: 4px 10px; border-radius: 99px; font-size: 11px;">Active</span>' if u.get("is_active") else '<span style="color: #f87171; background: rgba(248,113,113,0.1); padding: 4px 10px; border-radius: 99px; font-size: 11px;">Suspended</span>'
        
        rows += f"""
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 14px 16px; font-weight: bold; color: #ffffff;">{u.get('full_name', '')}</td>
          <td style="padding: 14px 16px; color: #94a3b8; font-family: monospace;">{u.get('email', '')}</td>
          <td style="padding: 14px 16px; color: {role_color}; font-weight: bold; text-transform: uppercase; font-size: 11px;">{u.get('role', 'user')}</td>
          <td style="padding: 14px 16px;">{status_badge}</td>
          <td style="padding: 14px 16px; color: #cbd5e1;">{u.get('organization', 'General')}</td>
          <td style="padding: 14px 16px; color: #64748b; font-size: 12px;">{u.get('created_at', '')}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <title>CognitiveDoc AI - Registered Users</title>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; margin: 0; padding: 32px; }}
        .container {{ max-width: 1000px; margin: 0 auto; }}
        .header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; }}
        h1 {{ margin: 0; font-size: 24px; color: #ffffff; }}
        .badge {{ background: rgba(14,165,233,0.15); color: {db_badge_color}; border: 1px solid rgba(14,165,233,0.3); padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: bold; }}
        table {{ width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; }}
        th {{ background: #1e293b; text-align: left; padding: 14px 16px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }}
        .links {{ margin-top: 20px; text-align: right; }}
        .links a {{ color: #38bdf8; text-decoration: none; font-size: 13px; margin-left: 16px; }}
        .links a:hover {{ text-decoration: underline; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>Registered Users Directory (Backend View)</h1>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Active Storage Engine: <strong style="color: {db_badge_color};">{db_engine}</strong></p>
          </div>
          <div class="badge">{len(users)} Total Registered Users</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>Organization</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>

        <div class="links">
          <a href="/api/users" target="_blank">&rarr; Raw JSON View</a>
          <a href="/docs" target="_blank">&rarr; Swagger Docs</a>
          <a href="http://localhost:5173/admin/users" target="_blank">&rarr; Frontend Admin Portal</a>
        </div>
      </div>
    </body>
    </html>
    """
    return html

@app.get("/api/health")
def health_check():
    from app.db.mongodb import is_mongo_connected
    mongo_status = is_mongo_connected()
    return {
        "status": "online",
        "service": "CognitiveDoc AI Core",
        "version": "2.0.0",
        "database_engine": "MongoDB Atlas (NoSQL Cloud)" if mongo_status else "SQLite 3 (Local Embedded)",
        "mongodb_connected": mongo_status,
        "models_status": "Ready",
        "zero_api_keys_required": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
