import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_text(text: str) -> str:
    """
    Clean and preprocess legal text for ML models
    """
    if not isinstance(text, str) or not text.strip():
        return ""
    
    # Remove special characters and convert to lowercase
    text = re.sub(r"[^a-zA-Z0-9]", " ", text).lower()
    
    # Tokenize
    tokens = text.split()
    
    # Remove stopwords and lemmatize
    try:
        sw = set(stopwords.words('english'))
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in sw]
    except Exception:
        pass
    
    return " ".join(tokens)
