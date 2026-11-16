import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const TIME_SLOTS = [
  "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM", "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM",
  "2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM", "3:00 PM - 3:30 PM", "3:30 PM - 4:00 PM",
];

export default function AppointmentScheduler() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(null);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!date || !slot) {
      setError("Please select both a date and a time slot to proceed.");
      return;
    }
    navigate("/ev-services/payment");
  };

  return (
    <StepScreen headerTitle="EV Services Booking" title="Schedule your appointment" backTo={-1}>
      <TextField label="Date" type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
      <h3 className="mb-3 mt-6 text-sm font-bold text-slate-900">Select a time slot</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TIME_SLOTS.map((s) => (
          <button
            key={s}
            onClick={() => setSlot(s)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              slot === s
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
