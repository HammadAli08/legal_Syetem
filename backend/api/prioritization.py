from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.model_loader import load_prioritization_model
from services.text_processor import preprocess_text

router = APIRouter()

class PrioritizationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Legal case text to prioritize")

class PrioritizationResponse(BaseModel):
    priority: str
    confidence: float = None

@router.post("/predict", response_model=PrioritizationResponse)
async def predict_priority(request: PrioritizationRequest):
    """
    Predict case urgency: High, Medium, or Low
    """
    try:
        pipeline, label_encoder = load_prioritization_model()
        
        # Preprocess text
        cleaned_text = preprocess_text(request.text)
        
        if not cleaned_text:
            raise HTTPException(status_code=400, detail="Text preprocessing resulted in empty string")
        
        # Predict
        prediction = pipeline.predict([cleaned_text])
        label = label_encoder.inverse_transform(prediction)[0]
        
        return PrioritizationResponse(priority=label)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prioritization error: {str(e)}")
