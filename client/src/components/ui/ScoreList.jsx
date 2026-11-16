export default function ScoreList({ scores }) {
  const entries = Object.entries(scores || {});
  if (!entries.length) return null;

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-card">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </dt>
          <dd className="mt-0.5 text-sm font-bold text-emerald-700">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
