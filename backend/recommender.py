# recommender.py
def fertilizer_recommendation(ndvi, humidity=None, crop_type=None):
    if ndvi is None:
        return "NDVI not available — cannot recommend now."
    try:
        ndvi = float(ndvi)
    except:
        return "Invalid NDVI"
    if ndvi < 0.30:
        return "Low NDVI: Recommend soil test. Apply Nitrogen-rich (Urea) + balanced NPK. Ensure irrigation."
    elif ndvi < 0.50:
        return "Moderate NDVI: Consider balanced NPK and monitor pests. Slight irrigation recommended."
    else:
        return "Healthy NDVI: Continue current practices and monitor."
