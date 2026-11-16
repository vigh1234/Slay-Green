import { useState } from "react";
import { User, UserRound, Users, Users2 } from "lucide-react";
import OptionCard from "../../components/ui/OptionCard.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const OPTIONS = [
  { value: "Alone", label: "Single", icon: User },
  { value: "As a couple", label: "As a couple", icon: UserRound },
  { value: "As a family", label: "As a family", icon: Users },
  { value: "With a group of 4", label: "With a group of 4", icon: Users2 },
];

/** Shared "who's travelling" step for both green-stay and advanced-stay search. */
export default function TravelPartyPicker({ onNext }) {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return alert("Select an option to continue!");
    onNext(selected);
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-lg font-extrabold text-slate-900">Choose a Travel Party</h2>
      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(selected === opt.value ? null : opt.value)}
          />
        ))}
      </div>
      <NextButton onClick={handleNext} />
    </div>
  );
}
