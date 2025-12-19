from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import classification, prioritization, chat
import nltk

# Download NLTK data on startup
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)
except:
    pass

app = FastAPI(
    title="Legal AI API",
    description="AI-powered legal case management system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend domain in production
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

@app.get("/health")
def health_check():
    return {"status": "healthy"}
