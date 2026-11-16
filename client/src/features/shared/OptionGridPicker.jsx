import { useState } from "react";
import OptionCard from "../../components/ui/OptionCard.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

/**
 * Generic single-select grid of icon+label cards, used by every "choose a
 * type/category" step across vehicle, electronics and EV search flows.
 */
export default function OptionGridPicker({ title, groups, buttonLabel = "Next", onNext }) {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return alert("Select an option to continue!");
    onNext(selected);
  };

  return (
    <div>
      {title && <h2 className="mb-6 text-center text-lg font-extrabold text-slate-900">{title}</h2>}
      {groups.map((group) => (
        <div key={group.label || "default"} className="mb-6">
          {group.label && (
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">{group.label}</h3>
          )}
          <div className="flex flex-wrap gap-3">
            {group.options.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                label={opt.label}
                selected={selected === opt.value}
                onClick={() => setSelected(selected === opt.value ? null : opt.value)}
              />
            ))}
          </div>
        </div>
      ))}
      <NextButton onClick={handleNext}>{buttonLabel}</NextButton>
    </div>
  );
}
