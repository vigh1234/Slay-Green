import { MapPin, ExternalLink } from "lucide-react";

export default function RecommendationCard({ item, onLocate, onOpen }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-emerald-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-extrabold text-slate-900">{item.name}</h3>
        {item.coordinates && (
          <button
            onClick={() => onLocate?.(item)}
            title="Show on map"
            className="shrink-0 rounded-full bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
          >
            <MapPin size={16} />
          </button>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {item.fields
          .filter((f) => f.value)
          .map((f) => (
            <div key={f.key} className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {f.label}
              </dt>
              <dd className="truncate text-sm font-medium text-slate-700">{f.value}</dd>
            </div>
          ))}
      </dl>
      {onOpen && (
        <button
          onClick={() => onOpen(item)}
          className="mt-1 flex items-center gap-1 self-start text-xs font-semibold text-emerald-700 hover:underline"
        >
          Search more <ExternalLink size={12} />
        </button>
      )}
    </div>
  );
}
