import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Diagnosis() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Select from gallery or camera
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Open camera (mobile)
  const openCamera = () => {
    fileInputRef.current.setAttribute("capture", "environment");
    fileInputRef.current.click();
  };

  // Upload to backend and navigate to result page
  const diagnose = async () => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/predict/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Navigate to result page with prediction data
      navigate("/diagnosis/result", { state: data });

    } catch (error) {
      alert(t("diagnosis.failed", "Detection failed. Try again."));
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("diagnosis.title")}
      </h1>

      {/* Preview */}
      {image && (
        <div className="mb-5">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-full rounded-xl shadow"
          />
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm flex flex-col gap-1 border border-blue-100 dark:border-blue-800/30">
            <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">📷 Image Quality Feedack</span>
            {image.size < 50000 ? (
              <span className="text-red-600 font-medium text-xs flex items-center gap-1">⚠️ Image blurry or too small</span>
            ) : (
              <span className="text-green-600 font-medium text-xs flex items-center gap-1">✔️ Resolution passes check</span>
            )}
            <span className="text-blue-700 dark:text-blue-400 text-xs">Tip: Take a closer, clear leaf photo for the best AI accuracy.</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <button
        onClick={openCamera}
        className="w-full bg-blue-600 text-white py-3 rounded-xl mb-3 shadow hover:bg-blue-700"
      >
        {t("diagnosis.takePhoto", "Take a Photo")}
      </button>

      <button
        onClick={() => fileInputRef.current.click()}
        className="w-full bg-green-600 text-white py-3 rounded-xl shadow hover:bg-green-700"
      >
        {t("diagnosis.upload", "Upload from Gallery")}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />

      {/* Diagnose Button */}
      {image && (
        <button
          onClick={diagnose}
          className="w-full bg-black text-white py-3 mt-4 rounded-xl shadow hover:bg-gray-800"
        >
          {t("diagnosis.diagnose", "Diagnose Crop Disease")}
        </button>
      )}
    </div>
  );
}
