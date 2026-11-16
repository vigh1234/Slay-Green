import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepScreen from "../../components/layout/StepScreen.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const SERVICE_TYPES = [
  "TATA Power", "Charzer", "Delta Electronics India", "Fortum India", "Mass - Tech",
  "Exicom", "Okaya", "ABB", "Verdemobility", "Magenta", "Energy Efficiency Services Ltd",
];

export default function ServiceProviders() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(SERVICE_TYPES); // default: all selected

  const toggle = (s) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleNext = () => {
    if (selected.length === 0) return alert("Please select at least one service provider.");
    navigate("/ev-services/schedule");
  };

  return (
    <StepScreen headerTitle="EV Services Booking" title="Choose your service provider" backTo={-1}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SERVICE_TYPES.map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
              selected.includes(s)
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
