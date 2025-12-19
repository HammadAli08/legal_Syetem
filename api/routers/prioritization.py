from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os
from groq import Groq

router = APIRouter()

class PrioritizationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Legal case text to prioritize")

class PrioritizationResponse(BaseModel):
    priority: str
    confidence: float = 1.0

@router.post("/predict", response_model=PrioritizationResponse)
async def predict_priority(request: PrioritizationRequest):
    """
    Predict case urgency: High, Medium, or Low using Groq LLM
    """
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        prompt = f"""Analyze the following legal case snippet and determine its priority/urgency. 
Classify it into exactly one of these levels: HIGH, MEDIUM, or LOW.
Return ONLY the priority level in uppercase.

Criteria:
- HIGH: Immediate danger, human rights violations, or time-sensitive criminal matters.
- MEDIUM: Standard litigation, financial disputes, or ongoing civil cases.
- LOW: Administrative matters, documentation requests, or non-urgent filings.

Case Text:
{request.text[:2000]}

Priority:"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=10
        )
        
        priority = response.choices[0].message.content.strip().upper()
        if "HIGH" in priority: priority = "High"
        elif "LOW" in priority: priority = "Low"
        else: priority = "Medium"
        
        return PrioritizationResponse(priority=priority)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prioritization error: {str(e)}")
