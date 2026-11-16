export default function OptionCard({ icon: Icon, label, selected, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-[46%] flex-1 flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-card transition ${
        selected
          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60"
      } ${className}`}
    >
      {Icon && <Icon size={28} className="text-emerald-600" />}
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
  );
}
