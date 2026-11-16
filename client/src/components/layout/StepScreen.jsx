import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";

/**
 * Shared shell for every feature screen. No header bar — just a back button
 * floating above the content. Mirrors the home page: soft emerald gradient
 * with blurred blobs, a bold heading, and the content in a glass card.
 *
 * `headerTitle` is shown as a small pill above the heading (e.g. the name of
 * the feature the screen belongs to).
 */
export default function StepScreen({ title, subtitle, children, headerTitle, backTo, onBack, cartTo }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    if (backTo !== undefined && backTo !== null) return navigate(backTo);
    navigate(-1);
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#a7f3d0 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-14 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-x-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          {cartTo && (
            <button
              onClick={() => navigate(cartTo)}
              aria-label="Open cart"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ShoppingCart size={16} /> Cart
            </button>
          )}
        </div>

        <div className="mt-6 animate-fade-up">
          <div className="text-center">
            {headerTitle && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {headerTitle}
              </span>
            )}
            {title && (
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            )}
            {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{subtitle}</p>}
          </div>

          <div
            className={`rounded-[2rem] border border-white bg-white/85 p-5 shadow-2xl shadow-emerald-100 backdrop-blur sm:p-8 ${
              headerTitle || title || subtitle ? "mt-7" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
