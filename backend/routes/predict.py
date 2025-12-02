from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("/")
async def predict(file: UploadFile = File(...)):
    # Read uploaded file (not used now, only placeholder)
    contents = await file.read()

    # TEMPORARY STATIC RESPONSE
    # Just to prevent errors and keep backend running
    return {
        "disease": "Not Implemented",
        "confidence": 0,
        "symptoms": "N/A",
        "treatment": "Disease prediction model not added yet"
    }
