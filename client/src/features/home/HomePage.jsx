import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Lock, Home, Car, Camera, ClipboardCheck, ShieldCheck, Leaf,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { FEATURE_GROUPS, FEATURE_ITEMS, SURVEY_ITEM } from "../../config/features.js";
import heroImg from "../../assets/images/hero-illustration.svg";

const GROUP_ICONS = { "Travel & Mobility": Car, Lifestyle: Home, "AI Tools": Camera };

/** Floating glass chip that sits around the hero illustration. */
function Chip({ icon: Icon, label, className, delay }) {
  return (
    <div
      className={`absolute hidden animate-float items-center gap-2 rounded-2xl border border-white bg-white/90 px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xl shadow-emerald-200/60 backdrop-blur sm:flex ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
        <Icon size={15} />
      </span>
      {label}
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:120ms]">
      <div className="absolute -inset-4 -z-0 rotate-3 rounded-[3rem] bg-gradient-to-br from-emerald-300/50 to-teal-300/40 blur-2xl" />
      <img
        src={heroImg}
        alt="Wind turbines, a solar-powered home and an electric car charging in green hills"
        className="relative w-full rounded-[2.75rem] border-4 border-white shadow-2xl shadow-emerald-200"
        width="640"
        height="600"
        fetchPriority="high"
      />
      <Chip icon={Home} label="Eco stays" className="-left-4 top-10" delay="0s" />
      <Chip icon={Car} label="Green rides" className="-right-3 top-1/3" delay="1.2s" />
      <Chip icon={Camera} label="Smart scans" className="-bottom-4 left-10" delay="2.2s" />
    </div>
  );
}

function Hero({ isAuthenticated, firstName, onBrowse }) {
  const navigate = useNavigate();
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-16 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-24 lg:pt-16">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
          <Sparkles size={14} /> {isAuthenticated ? "Welcome back" : "Sustainable choices, simplified"}
        </span>

        {isAuthenticated ? (
          <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Hi {firstName}, ready to go <span className="text-emerald-600">greener?</span>
          </h1>
        ) : (
          <h1 className="mt-6 text-5xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Find a greener way to <span className="text-emerald-600">live.</span>
          </h1>
        )}

        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          {isAuthenticated
            ? "Your tools are unlocked. Search eco-friendly stays and vehicles, find EV charging, scan products and more — all in one place."
            : "Discover eco-friendly stays, green vehicles, sustainable electronics and more — with intelligent tools designed around your needs."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate(SURVEY_ITEM.to)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Take the survey <ArrowRight size={17} />
              </button>
              <button
                onClick={onBrowse}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
              >
                Browse tools
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Create account <ArrowRight size={17} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-slate-500">
          {isAuthenticated ? (
            <>
              <ShieldCheck size={17} className="text-emerald-600" />
              All Slay Green tools are unlocked for your account.
            </>
          ) : (
            <>
              <Lock size={16} className="text-emerald-600" />
              Sign in or create an account to unlock every tool.
            </>
          )}
        </div>
      </div>

      <HeroArt />
    </section>
  );
}

/** Logged-out view: a short preview of what's behind the sign-in. */
function LockedPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-20 lg:px-10">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          The full toolkit is one sign-in away
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Create an account to unlock every tool below. Until then, feel free to read more about Slay Green or get in touch.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {FEATURE_GROUPS.filter((g) => GROUP_ICONS[g.name]).map((group) => {
          const Icon = GROUP_ICONS[group.name];
          const items = FEATURE_ITEMS.filter((f) => f.group === group.name);
          return (
            <button
              key={group.name}
              onClick={() => navigate("/login")}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white/85 p-6 text-left shadow-xl shadow-emerald-100 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon size={24} />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                  <Lock size={12} /> Sign in to unlock
                </span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">{group.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{group.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {items.slice(0, 4).map((i) => (
                  <li key={i.to} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {i.label}
                  </li>
                ))}
                {items.length > 4 && (
                  <li className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    +{items.length - 4} more
                  </li>
                )}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-800 p-8 text-white shadow-2xl shadow-emerald-300/50 sm:p-12">
        <Leaf className="pointer-events-none absolute -right-6 -top-6 text-white/10" size={200} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight sm:text-3xl">Ready to unlock everything?</h3>
            <p className="mt-2 max-w-md text-sm text-emerald-50/90">
              Log in to search stays and vehicles, find EV charging, scan products, shop the marketplace and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/register")} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-50">
              Create account
            </button>
            <button onClick={() => navigate("/login")} className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Logged-in view: every tool, grouped. */
function Dashboard() {
  return (
    <section id="tools" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pb-20 lg:px-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Your tools</h2>
          <p className="mt-2 text-slate-600">Pick something to get started.</p>
        </div>
        <Link
          to={SURVEY_ITEM.to}
          className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50 sm:self-auto"
        >
          <ClipboardCheck size={16} /> {SURVEY_ITEM.label}
        </Link>
      </div>

      <div className="space-y-12">
        {FEATURE_GROUPS.map((group) => {
          const items = FEATURE_ITEMS.filter((f) => f.group === group.name);
          if (!items.length) return null;
          return (
            <div key={group.name}>
              <div className="mb-4 flex items-baseline gap-3">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-emerald-700">{group.name}</h3>
                <span className="hidden text-sm text-slate-500 sm:inline">{group.blurb}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex flex-col rounded-3xl border border-white bg-white/85 p-5 shadow-lg shadow-emerald-100 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <item.icon size={22} />
                    </span>
                    <h4 className="mt-4 text-base font-extrabold text-slate-900">{item.label}</h4>
                    <p className="mt-1 flex-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                      Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="py-24"><Loader label="Loading..." /></div>;

  const firstName = user?.name?.split(" ")[0] || "there";
  const scrollToTools = () => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

      <Hero isAuthenticated={isAuthenticated} firstName={firstName} onBrowse={scrollToTools} />
      {isAuthenticated ? <Dashboard /> : <LockedPreview />}
    </div>
  );
}
