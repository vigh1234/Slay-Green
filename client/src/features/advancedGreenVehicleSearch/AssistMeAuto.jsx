import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedGreenVehicleContext } from "../../context/AdvancedGreenVehicleContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import LocationAutocomplete from "../../components/ui/LocationAutocomplete.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const PREFERENCES = [
  "Low Maintenance", "High Resale Value", "Long Range", "Fast Charging",
  "Budget Friendly", "Premium Brand", "Family Friendly", "Off-Road Capable",
];

export default function AssistMeAuto() {
  const navigate = useNavigate();
  const { destination3, setDestination3, selectedPreferences1, setSelectedPreferences1 } =
    useContext(AdvancedGreenVehicleContext);
  const [destInput, setDestInput] = useState(destination3);

  const togglePref = (pref) =>
    setSelectedPreferences1((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );

  const handleNext = () => {
    if (!destInput) return alert("Please enter a location");
    setDestination3(destInput);
    navigate("/advanced-vehicle/type");
  };

  return (
    <StepScreen headerTitle="Advanced Green Vehicle Search" title="Assist me — Vehicle" backTo="/">
      <LocationAutocomplete value={destInput} onChange={setDestInput} placeholder="Where do you need the vehicle?" />
      <h3 className="mb-3 mt-8 text-sm font-bold text-slate-900">Choose your preferences</h3>
      <div className="flex flex-wrap gap-2">
        {PREFERENCES.map((pref) => (
          <button
            key={pref}
            onClick={() => togglePref(pref)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
              selectedPreferences1.includes(pref)
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {pref}
          </button>
        ))}
      </div>
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
