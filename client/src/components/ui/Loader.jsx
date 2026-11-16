import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading recommendations..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
