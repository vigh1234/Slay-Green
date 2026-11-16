import {
  Leaf, Target, Eye, Home, Car, Cpu, ShoppingCart, Camera, ClipboardCheck,
  Search, Scale, CheckCheck, Lightbulb, HeartHandshake, Handshake, Info,
} from "lucide-react";
import heroImg from "../assets/images/hero-illustration.svg";

const CAPABILITIES = [
  { icon: Home, title: "Eco-friendly stays", text: "Search hotels, homestays, hostels and lodges that put sustainability first, from quick searches to detailed, preference-led ones." },
  { icon: Car, title: "Greener mobility", text: "Find electric and hybrid vehicles, charging stations, battery-swapping centres and EV service appointments in one flow." },
  { icon: Cpu, title: "Sustainable electronics", text: "Discover consumer electronics near you that are built with the planet in mind." },
  { icon: ShoppingCart, title: "A marketplace with ESG insight", text: "List and browse products, each with an environmental, societal and governance analysis." },
  { icon: Camera, title: "AI image tools", text: "Scan a product photo for sustainability details, or try clothes on virtually before you buy." },
  { icon: ClipboardCheck, title: "Personalised to you", text: "A short survey helps Slay Green understand your needs so suggestions feel relevant, not generic." },
];

const STEPS = [
  { icon: Search, title: "Discover", text: "Explore sustainable stays, vehicles, electronics and services." },
  { icon: Scale, title: "Compare", text: "Use the tools to narrow options down to what fits your needs and budget." },
  { icon: CheckCheck, title: "Choose", text: "Make an informed decision that works for your lifestyle and for the planet." },
];

const VALUES = [
  { icon: Lightbulb, title: "Clarity", text: "Plain-language insights instead of jargon and green buzzwords." },
  { icon: HeartHandshake, title: "Practicality", text: "Suggestions you can act on today, not just ideas to admire." },
  { icon: Handshake, title: "Honesty", text: "We surface scores and trade-offs so you can judge for yourself." },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pt-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <Leaf size={14} /> About Slay Green
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Making greener choices <span className="text-emerald-600">easy</span> — and everyday.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Slay Green is a sustainability companion that brings eco-friendly stays, greener ways to
            travel and more responsible products together in one place — shaped around what matters to you.
          </p>
        </div>
        <img
          src={heroImg}
          alt=""
          className="mx-auto w-full max-w-md animate-fade-up rounded-[2.5rem] border-4 border-white shadow-2xl shadow-emerald-200 [animation-delay:120ms]"
        />
      </section>

      {/* Mission & vision */}
      <section className="relative mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-2 lg:px-10">
        {[
          { icon: Target, title: "Our mission", text: "To make sustainable options easy to find, easy to compare and easy to choose, so that greener living becomes the default rather than the exception." },
          { icon: Eye, title: "Our vision", text: "A world where everyday decisions — where we stay, how we travel, what we buy — quietly work in favour of the planet." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-3xl border border-white bg-white/85 p-8 shadow-xl shadow-emerald-100 backdrop-blur">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <Icon size={24} />
            </span>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      {/* What you can do */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">What you can do with Slay Green</h2>
          <p className="mt-3 text-slate-600">One account, a full set of tools for greener everyday decisions.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-3xl border border-white bg-white/85 p-6 shadow-lg shadow-emerald-100 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <Icon size={22} />
                  </span>
                  <span className="text-4xl font-black text-white/15">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">What we stand for</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
              <Icon size={24} className="text-emerald-600" />
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm leading-6 text-slate-600">
          <Info size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          <p>
            Recommendations are generated with the help of AI and live place data. They are a helpful
            starting point — please confirm details such as prices, availability and certifications with
            the provider before you book or buy.
          </p>
        </div>
      </section>
    </div>
  );
}
