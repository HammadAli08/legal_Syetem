from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os
from groq import Groq

router = APIRouter()

class ClassificationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Legal case text to classify")

class ClassificationResponse(BaseModel):
    category: str
    confidence: float = 1.0

@router.post("/predict", response_model=ClassificationResponse)
async def predict_category(request: ClassificationRequest):
    """
    Classify legal case into: Civil, Criminal, or Constitutional using Groq LLM
    """
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        prompt = f"""Analyze the following legal case snippet and classify it into exactly one of these categories: CIVIL, CRIMINAL, or CONSTITUTIONAL.
Return ONLY the category name in uppercase.

Case Text:
{request.text[:2000]}  # Limiting length for prompt

Category:"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=10
        )
        
        category = response.choices[0].message.content.strip().upper()
        # Validation to ensure we return one of the expected labels even if LLM slightly fluctuates
        if "CRIMINAL" in category: category = "Criminal"
        elif "CONSTITUTIONAL" in category: category = "Constitutional"
        else: category = "Civil"
        
        return ClassificationResponse(category=category)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")
