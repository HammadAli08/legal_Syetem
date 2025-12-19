from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from api.services.model_loader import load_classification_model
from api.services.text_processor import preprocess_text

router = APIRouter()

class ClassificationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Legal case text to classify")

class ClassificationResponse(BaseModel):
    category: str
    confidence: float = None

@router.post("/predict", response_model=ClassificationResponse)
async def predict_category(request: ClassificationRequest):
    """
    Classify legal case into: Civil, Criminal, or Constitutional
    """
    try:
        pipeline, label_encoder = load_classification_model()
        
        # Preprocess text
        cleaned_text = preprocess_text(request.text)
        
        if not cleaned_text:
            raise HTTPException(status_code=400, detail="Text preprocessing resulted in empty string")
        
        # Predict
        prediction = pipeline.predict([cleaned_text])
        label = label_encoder.inverse_transform(prediction)[0]
        
        return ClassificationResponse(category=label)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")
