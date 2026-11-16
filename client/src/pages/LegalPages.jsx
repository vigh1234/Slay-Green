import { Link } from "react-router-dom";
import { ShieldCheck, FileText } from "lucide-react";

const UPDATED = "16 November 2026";

function LegalLayout({ icon: Icon, badge, title, intro, sections }) {
  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <article className="relative mx-auto max-w-3xl px-6 py-14 lg:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
          <Icon size={14} /> {badge}
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm font-semibold text-slate-400">Last updated: {UPDATED}</p>
        <p className="mt-6 text-base leading-7 text-slate-600">{intro}</p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-white bg-white/85 p-6 shadow-2xl shadow-emerald-100 backdrop-blur sm:p-10">
          {sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="text-lg font-extrabold text-slate-900">
                <span className="mr-2 text-emerald-600">{i + 1}.</span>
                {s.title}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-2 text-sm leading-7 text-slate-600">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600 marker:text-emerald-500">
                  {s.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
            </section>
          ))}
          <p className="border-t border-slate-100 pt-6 text-sm text-slate-500">
            Questions about this page? <Link to="/contact" className="font-semibold text-emerald-700 hover:underline">Contact us</Link>.
          </p>
        </div>
      </article>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout
      icon={ShieldCheck}
      badge="Privacy"
      title="Privacy Policy"
      intro="This policy explains what information Slay Green collects, how it is used, and the choices you have. We aim to collect only what we need to provide the service."
      sections={[
        {
          title: "Information we collect",
          body: ["Depending on how you use Slay Green, we may collect:"],
          list: [
            "Account details — your name, email address and a securely hashed password (we never store your password in plain text).",
            "Survey answers you choose to provide, used to personalise recommendations.",
            "Content you submit — such as destinations, addresses or locations you type, images you upload for scanning or virtual try-on, marketplace listings, and messages you send through the Contact form.",
            "Basic technical data — a sign-in token is kept in your browser so you stay signed in until it expires or you sign out.",
          ],
        },
        {
          title: "How we use information",
          body: ["We use your information to run your account, deliver search results and recommendations, analyse the images you upload, process payments you initiate, respond to your messages, and keep the service secure and working properly."],
        },
        {
          title: "Third-party services",
          body: ["To provide certain features we share only the information needed with trusted providers, including:"],
          list: [
            "AI and mapping providers (such as Google) that generate recommendations, analyse images and look up places.",
            "Stripe, which processes payments. Card details are handled by Stripe and are not stored by Slay Green.",
            "Map tile providers (such as OpenStreetMap) used to display maps.",
          ],
        },
        {
          title: "Security and retention",
          body: ["We use industry-standard measures such as password hashing, signed session tokens and rate limiting to protect your account. We keep your information for as long as your account is active or as needed to provide the service and meet legal obligations."],
        },
        {
          title: "Your choices",
          body: ["You can sign out at any time, which removes the sign-in token from your browser. To ask for access to, correction of, or deletion of your information, get in touch through the Contact page and we will respond as soon as we reasonably can."],
        },
        {
          title: "Children",
          body: ["Slay Green is not directed at children under 13, and we do not knowingly collect their personal information."],
        },
        {
          title: "Changes to this policy",
          body: ["We may update this policy from time to time. The “last updated” date above shows when it last changed."],
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      icon={FileText}
      badge="Terms"
      title="Terms of Service"
      intro="By creating an account or using Slay Green you agree to these terms. Please read them carefully."
      sections={[
        {
          title: "Using Slay Green",
          body: ["Slay Green provides tools for discovering sustainable stays, vehicles, electronics and related services. You agree to use it lawfully and in line with these terms."],
        },
        {
          title: "Your account",
          body: ["You are responsible for keeping your sign-in details secure and for activity on your account. Provide accurate information and let us know if you suspect unauthorised use."],
        },
        {
          title: "Acceptable use",
          body: ["You agree not to:"],
          list: [
            "misuse the service, attempt to break or overload it, or access it by automated means without permission;",
            "upload content that is unlawful, infringing, misleading or harmful;",
            "attempt to access other people’s accounts or data.",
          ],
        },
        {
          title: "Recommendations and AI-generated content",
          body: ["Recommendations, scores and analyses are generated with the help of AI and third-party data. They are provided for information only and may be incomplete or out of date. Always verify details such as prices, availability and sustainability claims with the provider before you book, buy or rely on them."],
        },
        {
          title: "Marketplace listings",
          body: ["If you list a product, you are responsible for the accuracy and legality of your listing and for having the right to sell it. We may remove listings that break these terms."],
        },
        {
          title: "Payments",
          body: ["Payments are processed by Stripe. The amount and any applicable fees are shown before you confirm a payment."],
        },
        {
          title: "Intellectual property",
          body: ["The Slay Green name, design and software belong to us or our licensors. You keep ownership of content you submit and grant us permission to use it as needed to operate the service for you."],
        },
        {
          title: "Disclaimer and liability",
          body: ["The service is provided “as is” without warranties of any kind. To the fullest extent permitted by law, Slay Green is not liable for indirect or consequential losses arising from your use of the service or from decisions you make based on its recommendations."],
        },
        {
          title: "Changes and termination",
          body: ["We may update these terms or suspend accounts that breach them. Continued use after changes means you accept the updated terms."],
        },
      ]}
    />
  );
}
