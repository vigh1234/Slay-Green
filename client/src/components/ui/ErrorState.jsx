import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-600">
      <AlertTriangle className="text-red-500" size={32} />
      <p className="max-w-xs text-sm">{message || "Something went wrong. Please try again."}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw size={16} /> Retry
        </Button>
      )}
    </div>
  );
}
