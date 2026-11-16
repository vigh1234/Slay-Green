import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, Send, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import { SITE } from "../config/site.js";
import TextField from "../components/ui/TextField.jsx";
import TextArea from "../components/ui/TextArea.jsx";
import Button from "../components/ui/Button.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 4000;

const FAQ = [
  { q: "Do I need an account to use Slay Green?", a: "You can read the home, About and Contact pages without one. Sign in or create an account to unlock every tool." },
  { q: "How are recommendations generated?", a: "We combine what you tell us — like a destination, budget or preferences — with AI and live place data. Please confirm prices and availability with the provider before you book." },
  { q: "Can I list my own products?", a: "Yes. Once you are signed in, open the Marketplace and upload a product image to create a listing with an ESG analysis." },
  { q: "How is my data handled?", a: "Read our Privacy Policy for what we collect, why, and the choices you have." },
  { q: "I found a bug or have an idea.", a: "Please tell us using the form — mention the page you were on and what happened, and we'll take a look." },
];

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white bg-white/85 p-5 shadow-lg shadow-emerald-100 backdrop-blur">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-slate-900">{title}</p>
        <div className="mt-0.5 break-words text-sm text-slate-500">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: undefined, email: undefined, subject: "", message: "", website: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Name/email start as `undefined` so they pre-fill from the signed-in account
  // until the visitor edits them (an edited-to-empty field stays empty).
  const value = (field) =>
    form[field] ?? (field === "name" ? user?.name : field === "email" ? user?.email : "") ?? "";
  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const { email: contactEmail, phone, address } = SITE.contact;
  const hasDetails = contactEmail || phone || address;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: value("name").trim(),
      email: value("email").trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      website: form.website, // honeypot
    };
    if (!payload.name) return setError("Please enter your name");
    if (!EMAIL_RE.test(payload.email)) return setError("Please enter a valid email address");
    if (payload.message.length < 10) return setError("Your message is a little short — please add some detail");

    setSending(true);
    setError("");
    try {
      await api.post("/contact", payload);
      setSent(true);
      setForm({ name: undefined, email: undefined, subject: "", message: "", website: "" });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          (err?.request ? "Cannot reach the server. Please try again." : "Something went wrong. Please try again.")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <MessageCircle size={14} /> Contact
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            We’d love to <span className="text-emerald-600">hear</span> from you.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Questions, feedback or ideas for making Slay Green better? Send us a message and we’ll get back to you.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Form */}
          <div className="animate-fade-up rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-emerald-100 backdrop-blur sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} />
                </span>
                <h2 className="text-2xl font-black text-slate-950">Message sent</h2>
                <p className="max-w-sm text-sm text-slate-500">Thank you for reaching out. We’ll reply to the email address you provided.</p>
                <Button variant="outline" onClick={() => setSent(false)} className="mt-2">Send another message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <h2 className="text-xl font-black text-slate-950">Send us a message</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Name" required value={value("name")} onChange={update("name")} placeholder="Your name" autoComplete="name" maxLength={80} />
                  <TextField label="Email" required type="email" value={value("email")} onChange={update("email")} placeholder="you@example.com" autoComplete="email" />
                </div>
                <TextField label="Subject" value={form.subject} onChange={update("subject")} placeholder="What is this about?" maxLength={120} />
                <TextArea label="Message" required rows={6} value={form.message} onChange={update("message")} placeholder="Tell us how we can help..." maxLength={MAX_MESSAGE} />
                <p className="-mt-2 text-right text-[11px] text-slate-400">{form.message.length}/{MAX_MESSAGE}</p>

                {/* Honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} /></label>
                </div>

                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-600">{error}</p>
                )}
                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? "Sending..." : <>Send message <Send size={16} /></>}
                </Button>
              </form>
            )}
          </div>

          {/* Details + FAQ */}
          <div className="space-y-4">
            {hasDetails && (
              <div className="space-y-3">
                {contactEmail && (
                  <InfoCard icon={Mail} title="Email">
                    <a href={`mailto:${contactEmail}`} className="font-semibold text-emerald-700 hover:underline">{contactEmail}</a>
                  </InfoCard>
                )}
                {phone && (
                  <InfoCard icon={Phone} title="Phone">
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className="font-semibold text-emerald-700 hover:underline">{phone}</a>
                  </InfoCard>
                )}
                {address && <InfoCard icon={MapPin} title="Address">{address}</InfoCard>}
              </div>
            )}

            <div className="rounded-3xl border border-white bg-white/85 p-3 shadow-lg shadow-emerald-100 backdrop-blur">
              <h2 className="px-3 pb-1 pt-3 text-lg font-black text-slate-950">Quick answers</h2>
              {FAQ.map((item) => (
                <details key={item.q} className="group border-t border-slate-100 first-of-type:border-t-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3.5 text-sm font-bold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown size={17} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <p className="px-3 pb-4 text-sm leading-6 text-slate-500">
                    {item.a}{" "}
                    {item.q.startsWith("How is my data") && (
                      <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">Privacy Policy</Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
