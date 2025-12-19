from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import nltk
import os

# Configure NLTK to use /tmp for data downloads (required for Vercel)
nltk_data_path = os.path.join("/tmp", "nltk_data")
if not os.path.exists(nltk_data_path):
    os.makedirs(nltk_data_path, exist_ok=True)
nltk.data.path.append(nltk_data_path)

try:
    nltk.download('stopwords', download_dir=nltk_data_path, quiet=True)
    nltk.download('wordnet', download_dir=nltk_data_path, quiet=True)
    nltk.download('omw-1.4', download_dir=nltk_data_path, quiet=True)
except Exception as e:
    print(f"NLTK download warning: {e}")

from api.routers import classification, prioritization, chat

app = FastAPI(
    title="Legal AI API",
    description="AI-powered legal case management system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classification.router, prefix="/api/classification", tags=["Classification"])
app.include_router(prioritization.router, prefix="/api/prioritization", tags=["Prioritization"])
app.include_router(chat.router, prefix="/api/chat", tags=["Legal Assistant"])

@app.get("/")
def root():
    return {
        "message": "Legal AI API",
        "status": "operational",
        "endpoints": ["/api/classification", "/api/prioritization", "/api/chat"]
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
