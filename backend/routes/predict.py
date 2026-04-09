import os
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException
from loguru import logger
from dotenv import load_dotenv

# Try loading from backend and root dir
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
load_dotenv(env_path)
load_dotenv() # also fallback to standard execution dir

router = APIRouter(prefix="/predict", tags=["predict"])

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY")
PLANTNET_API_URL = os.getenv("PLANTNET_API_URL", "https://my-api.plantnet.org/v2/identify/all")

# Enhanced Treatment & Heuristic DB
TREATMENT_DB = {
    "blight": {
        "disease": "Blight Disease",
        "cause": "Fungal infection thriving in warm, wet conditions.",
        "medicine": "Metalaxyl + Mancozeb",
        "dosage": "2.5g per litre",
        "treatment": [
            "Remove infected lower leaves",
            "Apply copper-based fungicide",
            "Ensure good air circulation"
        ],
        "prevention": "Rotate crops and use drip irrigation to keep foliage dry."
    },
    "spot": {
        "disease": "Leaf Spot Disease",
        "cause": "Airborne fungal spores attaching to wet leaves.",
        "medicine": "Carbendazim or Neem Oil",
        "dosage": "2m per litre (Neem) or 1.5g per litre (Carbendazim)",
        "treatment": [
            "Remove infected leaves immediately",
            "Spray fungicide covering upper and lower leaf surfaces"
        ],
        "prevention": "Ensure proper plant spacing and avoid wet foliage overnight."
    },
    "rot": {
        "disease": "Fungal Rot",
        "cause": "Overwatering and poor soil drainage.",
        "medicine": "Mefenoxam fungicide",
        "dosage": "Apply to roots/soil per package instructions",
        "treatment": [
            "Improve drainage and stop overwatering",
            "Remove rotted material",
            "Treat surrounding healthy plants as a preventative"
        ],
        "prevention": "Ensure well-draining soil and avoid waterlogging."
    },
    "healthy": {
        "disease": "Healthy Plant",
        "cause": "N/A",
        "medicine": "None required",
        "dosage": "N/A",
        "treatment": ["No treatment required. Plant is healthy."],
        "prevention": "Maintain optimal watering and nutrient schedules."
    }
}

def get_treatment_info(plant_name: str, disease_name: str):
    name_lower = disease_name.lower() + " " + plant_name.lower()
    
    # Check Heuristics First
    if "spot" in name_lower:
        return TREATMENT_DB["spot"]
    if "yellow" in name_lower or "blight" in name_lower:
        return TREATMENT_DB["blight"]
    if "rot" in name_lower:
        return TREATMENT_DB["rot"]
    if "healthy" in name_lower:
        return TREATMENT_DB["healthy"]
        
    return {
        "disease": disease_name if "disease" in disease_name.lower() else f"{disease_name} Issue",
        "cause": "Unknown environmental or biological stress.",
        "medicine": "General Broad-Spectrum Fungicide",
        "dosage": "Consult local advisory",
        "treatment": ["Consult a local agronomist", "Isolate affected plants if possible"],
        "prevention": "Maintain garden hygiene and monitor regularly."
    }

@router.post("/")
async def predict(file: UploadFile = File(...)):
    # 1. Logging
    logger.info(f"Incoming prediction request: {file.filename} ({file.content_type})")
    
    # 2. Validation
    if not file.content_type.startswith("image/"):
        logger.error(f"Invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image (JPEG/PNG).")

    contents = await file.read()
    
    if not PLANTNET_API_KEY:
        logger.error("PLANTNET_API_KEY is missing from configuration.")
        return {
            "status": "error",
            "message": "Backend configuration issue. API Key missing."
        }

    # 3. Correct Multipart Format for PlantNet
    # PlantNet expects 'images' as the form field name
    files = {
        "images": (file.filename, contents, file.content_type)
    }
    data = {"organs": ["leaf"]} 
    
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                # Use params for API Key for better security/cleanliness
                response = await client.post(
                    PLANTNET_API_URL,
                    params={"api-key": PLANTNET_API_KEY},
                    files=files,
                    data=data
                )
                
                if response.status_code == 400:
                    logger.warning(f"PlantNet 400: {response.text}")
                    return {
                        "status": "error",
                        "message": "Image analysis failed, try another image (ensure it's JPEG/PNG and clear).",
                        "failed": True
                    }

                response.raise_for_status()
                res_data = response.json()
            except Exception as e:
                logger.error(f"PlantNet Connection Failure: {e}")
                return {
                    "status": "error",
                    "message": "Image analysis failed, try another image",
                    "failed": True
                }
            
            results = res_data.get("results", [])
            if not results:
                return {
                    "status": "error",
                    "message": "Image analysis failed, no matching plant found. Try another image.",
                    "failed": True
                }
            
            top_result = results[0]
            score = top_result.get("score", 0.0)
            species = top_result.get("species", {})
            scientific_name = species.get("scientificNameWithoutAuthor", "Unknown Plant")
            common_names = species.get("commonNames", [])
            
            plant_name = common_names[0] if common_names else scientific_name
            treatment_info = get_treatment_info(plant_name, plant_name)
            
            return {
                "plant": plant_name,
                "disease": treatment_info["disease"],
                "confidence": score,
                "cause": treatment_info.get("cause", "N/A"),
                "medicine": treatment_info.get("medicine", "N/A"),
                "dosage": treatment_info.get("dosage", "N/A"),
                "symptoms": f"Detected characteristics of {plant_name}.",
                "treatment": treatment_info["treatment"],
                "prevention": treatment_info["prevention"],
                "failed": False
            }
            
    except Exception as e:
        logger.error(f"Unexpected PlantNet Exception: {e}")
        return {
            "status": "error",
            "message": "An unexpected error occurred during prediction. Please try again.",
            "failed": True
        }
