export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Comp = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700",
    outline: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
    ghost: "text-emerald-700 shadow-none hover:bg-emerald-50",
    danger: "bg-red-50 text-red-700 shadow-none hover:bg-red-100",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
  };
  return (
    <Comp className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </Comp>
  );
}
