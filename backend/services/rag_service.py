import os
import requests
from typing import List, Dict
from qdrant_client import QdrantClient
from groq import Groq

class RAGService:
    def __init__(self):
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.qdrant_client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.collection_name = os.getenv("QDRANT_COLLECTION", "legal_precedents")
        
    def get_embeddings(self, text: str) -> List[float]:
        """Generate embeddings using HuggingFace Inference API"""
        api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
        
        headers = {"Authorization": f"Bearer {self.hf_api_key}"}
        response = requests.post(api_url, headers=headers, json={"inputs": text})
        
        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.text}")
        
        return response.json()
    
    def retrieve_documents(self, query: str, k: int = 10) -> List[Dict]:
        """Retrieve relevant documents from Qdrant"""
        query_vector = self.get_embeddings(query)
        
        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=k
        )
        
        documents = []
        for result in results:
            documents.append({
                "content": result.payload.get("text", ""),
                "metadata": result.payload.get("metadata", {}),
                "score": result.score
            })
        
        return documents
    
    def generate_response(self, query: str, context: List[Dict], chat_history: List[Dict]) -> str:
        """Generate response using Groq LLM"""
        
        # Format context
        context_text = "\n\n".join([
            f"Document {i+1}:\n{doc['content']}" 
            for i, doc in enumerate(context[:5])
        ])
        
        # Build messages
        messages = [
            {
                "role": "system",
                "content": """You are a Senior Legal Research Assistant. Your mandate is to analyze the provided legal documents and answer the user's question with forensic precision.

### CRITICAL INSTRUCTIONS:
1. **Zero External Knowledge:** Answer strictly based on the provided Context below.
2. **No Hallucination:** If the answer is not in the context, state: "The provided legal documents do not contain sufficient information to answer this specific query."
3. **Evidence-Based:** Every claim must be supported by specific references.
4. **Tone:** Maintain formal, objective, non-advisory tone.

### REQUIRED OUTPUT FORMAT:

#### 1. Executive Summary
(A direct, 2-3 sentence answer to the core legal question.)

#### 2. Relevant Precedents & Analysis
(Detailed bullet points analyzing the retrieved text.)

#### 3. Conclusion
(Final summary based solely on provided context.)"""
            }
        ]
        
        # Add chat history
        for msg in chat_history[-6:]:  # Last 3 exchanges
            messages.append(msg)
        
        # Add current query with context
        messages.append({
            "role": "user",
            "content": f"Context:\n{context_text}\n\nQuestion: {query}"
        })
        
        # Call Groq API
        response = self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.1,
            max_tokens=2000
        )
        
        return response.choices[0].message.content

# Singleton instance
_rag_service = None

def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
