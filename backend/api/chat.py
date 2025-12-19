from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from services.rag_service import get_rag_service

router = APIRouter()

class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    chat_history: List[Message] = Field(default_factory=list)

class Source(BaseModel):
    content: str
    score: float
    metadata: Dict = {}

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]

@router.post("/ask", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Legal research assistant with context-aware responses
    """
    try:
        rag_service = get_rag_service()
        
        # Retrieve relevant documents
        documents = rag_service.retrieve_documents(request.message, k=10)
        
        # Convert chat history to dict format
        history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
        
        # Generate response
        answer = rag_service.generate_response(request.message, documents, history)
        
        # Format sources
        sources = [
            Source(
                content=doc["content"][:500],  # Truncate for response
                score=doc["score"],
                metadata=doc["metadata"]
            )
            for doc in documents[:5]
        ]
        
        return ChatResponse(answer=answer, sources=sources)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.post("/clear")
async def clear_history():
    """Clear chat history (client-side implementation)"""
    return {"message": "History cleared"}
