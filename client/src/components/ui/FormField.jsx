export default function FormField({ label, required, children }) {
  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </div>
  );
}
