import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedGreenStayContext } from "../../context/AdvancedGreenStayContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import LocationAutocomplete from "../../components/ui/LocationAutocomplete.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const PREFERENCES = [
  "Close to Mall", "High Air Quality", "Rich Nightlife", "Urban", "Outdoor Activities",
  "Close to Airport", "LGBTQ+ Friendly", "Support Local Economy", "Value For Money",
  "Close to Culture", "Not Chain/Franchise",
];

export default function AssistMeStay() {
  const navigate = useNavigate();
  const { destination2, setDestination2, selectedPreferences, setSelectedPreferences } =
    useContext(AdvancedGreenStayContext);
  const [destInput, setDestInput] = useState(destination2);

  const togglePref = (pref) =>
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );

  const handleNext = () => {
    if (!destInput) return alert("Please enter a destination");
    setDestination2(destInput);
    navigate("/advanced-stay/budget");
  };

  return (
    <StepScreen headerTitle="Advanced Green Stay Search" title="Assist me — Stay" backTo="/">
      <LocationAutocomplete value={destInput} onChange={setDestInput} placeholder="Where would you like to go?" />

      <h3 className="mb-3 mt-8 text-sm font-bold text-slate-900">Choose your preferences</h3>
      <div className="flex flex-wrap gap-2">
        {PREFERENCES.map((pref) => (
          <button
            key={pref}
            onClick={() => togglePref(pref)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
              selectedPreferences.includes(pref)
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
