import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 items-center justify-center gap-4 text-center">
      <Leaf size={40} className="text-emerald-600" />
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Page not found</h1>
      <p className="text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm font-semibold text-emerald-700 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
