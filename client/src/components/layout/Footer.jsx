import { Leaf, ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SITE } from "../../config/site.js";
import "./Footer.css";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const { email, phone, address } = SITE.contact;
  const socials = [
    { href: SITE.social.instagram, label: "Instagram", icon: Instagram },
    { href: SITE.social.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: SITE.social.x, label: "X", icon: Twitter },
  ].filter((s) => s.href);

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__cta">
          <div>
            <h2 className="footer__cta-title">
              {isAuthenticated ? "Keep making greener choices." : "Make your next choice a greener one."}
            </h2>
            <p className="footer__cta-text">
              {isAuthenticated
                ? "Take the survey so Slay Green can tailor its recommendations to you."
                : "Create an account to unlock every Slay Green tool — it only takes a moment."}
            </p>
          </div>
          <Link to={isAuthenticated ? "/survey" : "/register"} className="footer__cta-button">
            {isAuthenticated ? "Take the survey" : "Create account"} <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="footer__main">
          <div>
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon"><Leaf size={18} fill="currentColor" /></span>
              <span className="footer__logo-text">{SITE.name}</span>
            </Link>
            <p className="footer__description">
              Slay Green helps you discover eco-friendly stays, greener ways to travel and more
              sustainable products — all in one place.
            </p>
            {socials.length > 0 && (
              <div className="footer__socials">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="footer__social">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="footer__cols">
            <div>
              <p className="footer__heading">Explore</p>
              <nav className="footer__links">
                <Link className="footer__link" to="/">Home</Link>
                <Link className="footer__link" to="/about">About</Link>
                <Link className="footer__link" to="/contact">Contact</Link>
                {isAuthenticated ? (
                  <Link className="footer__link" to="/survey">Take the Survey</Link>
                ) : (
                  <Link className="footer__link" to="/login">Sign in</Link>
                )}
              </nav>
            </div>
            <div>
              <p className="footer__heading">Legal</p>
              <nav className="footer__links">
                <Link className="footer__link" to="/privacy">Privacy Policy</Link>
                <Link className="footer__link" to="/terms">Terms of Service</Link>
              </nav>
            </div>
            <div>
              <p className="footer__heading">Get in touch</p>
              <div className="footer__links">
                {email && <a className="footer__link footer__link--icon" href={`mailto:${email}`}><Mail size={14} /> {email}</a>}
                {phone && <a className="footer__link footer__link--icon" href={`tel:${phone.replace(/\s+/g, "")}`}><Phone size={14} /> {phone}</a>}
                {address && <span className="footer__text footer__link--icon"><MapPin size={14} /> {address}</span>}
                <Link className="footer__link" to="/contact">Send us a message</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <a href="#top" className="footer__back-to-top">Back to top <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="footer__wordmark" aria-hidden="true">slaygreen</div>
    </footer>
  );
}
