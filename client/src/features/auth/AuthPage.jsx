import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Leaf, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import heroImg from "../../assets/images/hero-illustration.svg";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  "Eco-friendly stay and vehicle search",
  "EV stations, services and battery swapping",
  "AI image scanning, virtual try-on and marketplace",
  "Recommendations tailored by your survey",
];

/**
 * One screen for both /login and /register (pass mode="login" | "register").
 * After success the visitor is sent back to the page they came from
 * (location.state.from, set by <ProtectedRoute>) or to the home page.
 */
export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="py-24"><Loader label="Loading..." /></div>;
  if (isAuthenticated && !submitting) return <Navigate to={redirectTo} replace />;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (isRegister && !form.name.trim()) return "Please enter your name";
    if (!EMAIL_RE.test(form.email.trim())) return "Please enter a valid email address";
    if (!form.password) return "Please enter your password";
    if (isRegister) {
      if (form.password.length < 8) return "Password must be at least 8 characters";
      if (form.password !== form.confirm) return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);

    setSubmitting(true);
    setError("");
    try {
      if (isRegister) {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      } else {
        await login({ email: form.email.trim(), password: form.password });
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          (err?.request ? "Cannot reach the server. Please try again." : "Something went wrong. Please try again.")
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-2 lg:px-10">
        {/* Story panel (desktop) */}
        <div className="hidden animate-fade-up lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <Leaf size={14} /> Slay Green
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
            Unlock the full <span className="text-emerald-600">Slay Green</span> experience.
          </h2>
          <ul className="mt-6 space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                {perk}
              </li>
            ))}
          </ul>
          <img
            src={heroImg}
            alt=""
            className="mt-8 w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-emerald-200/70"
          />
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md animate-fade-up">
          <div className="rounded-[2rem] border border-white bg-white/90 p-7 shadow-2xl shadow-emerald-100 backdrop-blur sm:p-9">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Leaf size={22} fill="currentColor" />
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister ? "Join Slay Green and live greener." : "Sign in to continue to Slay Green."}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {isRegister && (
                <TextField label="Name" value={form.name} onChange={update("name")} placeholder="Your name" autoComplete="name" maxLength={80} />
              )}
              <TextField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" autoComplete="email" />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={update("password")}
                placeholder={isRegister ? "At least 8 characters" : "Your password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              {isRegister && (
                <TextField label="Confirm password" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repeat your password" autoComplete="new-password" />
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (isRegister ? "Creating account..." : "Signing in...") : isRegister ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? "Already have an account?" : "New to Slay Green?"}{" "}
              <Link
                to={isRegister ? "/login" : "/register"}
                state={location.state}
                className="font-bold text-emerald-700 hover:underline"
              >
                {isRegister ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
