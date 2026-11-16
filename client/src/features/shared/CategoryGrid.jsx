import { useState } from "react";
import NextButton from "../../components/ui/NextButton.jsx";
import { PRODUCT_CATEGORIES } from "./productCategories.js";

/** Simple text-chip category picker, reused by the image-analysis flows. */
export default function CategoryGrid({ title = "Choose a category", buttonLabel = "Next", onNext }) {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return alert("Select a category to continue!");
    onNext(selected);
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-lg font-extrabold text-slate-900">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              selected === cat
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <NextButton onClick={handleNext}>{buttonLabel}</NextButton>
    </div>
  );
}
