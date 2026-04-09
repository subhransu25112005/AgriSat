import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SelectCrops() {
  const allCrops = [
    { name: "Grapes", icon: "/assets/illustrations/grapes.png" },
    { name: "Papaya", icon: "/assets/illustrations/papaya.png" },
    { name: "Olive", icon: "/assets/illustrations/olive.png" },
    { name: "Rose", icon: "/assets/illustrations/rose.png" },
    { name: "Sugarcane", icon: "/assets/illustrations/sugarcane.png" },
    { name: "Almond", icon: "/assets/illustrations/almond.png" },
    { name: "Apple", icon: "/assets/illustrations/apple.png" },
    { name: "Apricot", icon: "/assets/illustrations/apricot.png" },
    { name: "Banana", icon: "/assets/illustrations/banana.png" },
    { name: "Barley", icon: "/assets/illustrations/barley.png" },
    { name: "Bean", icon: "/assets/illustrations/bean.png" },
    { name: "Bitter Gourd", icon: "/assets/illustrations/bittergourd.png" },
    { name: "Black Bean", icon: "/assets/illustrations/blackbean.png" },
    { name: "Brinjal", icon: "/assets/illustrations/brinjal.png" },
    { name: "Cabbage", icon: "/assets/illustrations/cabbage.png" },
    {name: "Add" , icon: "add"}
  ];

  const { t } = useTranslation();
  const [selectedCrops, setSelectedCrops] = useState([]);

  // Handle add/remove logic
  const toggleCrop = (cropName) => {
    if (selectedCrops.includes(cropName)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== cropName));
    } else {
      if (selectedCrops.length < 8) {
        setSelectedCrops([...selectedCrops, cropName]);
      }
    }
  };

  // What happens when saving
  const saveCrops = () => {
    console.log("Selected crops:", selectedCrops);
    alert(t("selectCrops.saved", "Saved") + ": " + selectedCrops.join(", "));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center">{t("selectCrops.title")}</h2>
      <p className="text-center text-gray-500 mb-6">
        {t("selectCrops.subtitle", { max: 8 }, "Select up to 8 crops you are interested in")}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
  {allCrops.map((crop) => (
    <div
      key={crop.name}
      onClick={() => toggleCrop(crop.name)}
      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition 
        ${selectedCrops.includes(crop.name)
          ? "border-blue-600 bg-blue-50"
          : "border-gray-300"}`}
    >

      {crop.icon === "add" ? (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
          +
        </div>
      ) : (
        <img src={crop.icon} alt={crop.name} className="w-10 h-10" />
      )}

      <p className="mt-2 text-sm">{crop.name}</p>
    </div>
  ))}
</div>


      {/* Save Button */}
      <div className="flex justify-center mt-8 mb-10">
        <button
          onClick={saveCrops}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          {t("selectCrops.next")}
        </button>
      </div>
    </div>
  );
}
