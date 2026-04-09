export const DISEASE_KNOWLEDGE = {
  "blight": {
    severity: "Severe",
    spreadRisk: "High",
    yieldImpact: "30-50% crop loss if untreated",
    recoveryScore: 85,
    symptomsTracker: ["Dark circular spots", "Yellow halo around lesions", "Leaf drying"],
    advancedTreatment: [
      "Remove infected leaves immediately",
      "Spray Mancozeb (2.5g/L) on affected areas",
      "Repeat application after 7 days"
    ],
    smartAdvice: "Avoid watering overhead. Spray tomorrow early morning when humidity is lower.",
    organic: "Neem oil spray (5ml/L) or Baking soda mix (1 tbsp per gallon)",
    urgency: "🔴 Immediate Action Required"
  },
  "mildew": {
    severity: "Moderate",
    spreadRisk: "Very High",
    yieldImpact: "15-25% crop loss if untreated",
    recoveryScore: 90,
    symptomsTracker: ["White powdery spots on leaves", "Leaf yellowing", "Stunted growth"],
    advancedTreatment: [
      "Improve air circulation around plants",
      "Apply Sulfur-based fungicide",
      "Apply early in the morning"
    ],
    smartAdvice: "Ensure plants are spaced properly. Avoid overhead irrigation during humid weeks.",
    organic: "Milk spray (1 part milk to 9 parts water) or Garlic extract spray",
    urgency: "🟡 Treatment Recommended"
  },
  "rust": {
    severity: "Moderate",
    spreadRisk: "High",
    yieldImpact: "20-30% crop loss if untreated",
    recoveryScore: 80,
    symptomsTracker: ["Orange-brown pustules on leaves", "Premature defoliation", "Stunted growth"],
    advancedTreatment: [
      "Remove and destroy infected plant debris",
      "Apply Copper-based fungicide",
      "Rotate crops annually"
    ],
    smartAdvice: "Isolate affected section. Avoid planting susceptible varieties next year.",
    organic: "Copper spray or Sulfur dust application",
    urgency: "🟡 Monitor & Treat"
  },
  "spot": {
    severity: "Moderate",
    spreadRisk: "Medium",
    yieldImpact: "10-20% crop loss if untreated",
    recoveryScore: 88,
    symptomsTracker: ["Dark water-soaked spots", "Leaves falling off"],
    advancedTreatment: [
      "Remove heavily infected leaves",
      "Apply Copper-based fungicide (Fixed Dose)"
    ],
    smartAdvice: "Water at the base to keep foliage dry. Ensure soil health is maintained.",
    organic: "Baking soda spray or Compost tea",
    urgency: "🟡 Treatment Recommended"
  },
  "healthy": {
    severity: "Mild",
    spreadRisk: "Negligible",
    yieldImpact: "0%",
    recoveryScore: 100,
    symptomsTracker: ["Healthy green leaves", "No spots or discoloration"],
    advancedTreatment: [
      "No chemical intervention needed."
    ],
    smartAdvice: "Maintain optimal watering and nutrient levels. Good job!",
    organic: "Regular compost application and mulching",
    urgency: "🟢 Safe"
  }
};

export const getDiseaseIntelligence = (diseaseName) => {
  if (!diseaseName) return null;
  const name = diseaseName.toLowerCase();
  
  const rules = Object.keys(DISEASE_KNOWLEDGE);
  for (let rule of rules) {
    if (name.includes(rule)) {
      return DISEASE_KNOWLEDGE[rule];
    }
  }
  
  // Robust fallback for unknown diseases to avoid "Coming soon"
  return {
    severity: "Pending Analysis",
    spreadRisk: "Localised",
    yieldImpact: "Variable (5-15%)",
    recoveryScore: 75,
    symptomsTracker: ["Unusual coloration", "Structural stress"],
    advancedTreatment: ["Isolate affected plant", "Check soil PH and moisture"],
    smartAdvice: "A secondary visual check is recommended. Keep soil moisture stable.",
    organic: "General Neem-based biological pesticides",
    urgency: "🟡 Standard Monitoring"
  };
};
