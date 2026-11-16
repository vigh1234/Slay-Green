export default function Select({ label, required, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
