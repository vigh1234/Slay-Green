import { useState } from "react";
import LocationAutocomplete from "../../components/ui/LocationAutocomplete.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

/** Shared "where are you going" destination step. */
export default function DestinationForm({ initial = "", label = "Where would you like to go?", onNext }) {
  const [value, setValue] = useState(initial);

  const handleNext = () => {
    if (!value) return alert("Please enter a destination");
    onNext(value);
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-lg font-extrabold text-slate-900">{label}</h2>
      <LocationAutocomplete value={value} onChange={setValue} placeholder="City, region or landmark" />
      <NextButton onClick={handleNext} />
    </div>
  );
}
