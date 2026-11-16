import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Leaf, Menu, X, Info, Mail, ChevronLeft, ChevronRight, LogIn, LogOut, UserPlus, User, Home as HomeIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { FEATURE_GROUPS, FEATURE_ITEMS, SURVEY_ITEM } from "../../config/features.js";
import "./NavBar.css";

// Top-bar links. "Take the Survey" is part of the signed-in experience.
const PUBLIC_NAV = [
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
];
const getNavItems = (isAuthenticated) =>
  isAuthenticated ? [{ ...SURVEY_ITEM, primary: true }, ...PUBLIC_NAV] : PUBLIC_NAV;

function LinkItem({ item, onClick, collapsed }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `navbar__link ${isActive ? "navbar__link--active" : ""} ${collapsed ? "navbar__link--collapsed" : ""}`
      }
    >
      <Icon size={18} className="navbar__link-icon" />
      {!collapsed && <span className="navbar__link-label">{item.label}</span>}
    </NavLink>
  );
}

// Sign in / Register buttons, or the user's name + Sign out when logged in.
function AuthControls({ onNavigate, stacked = false }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const wrap = stacked ? "flex flex-col gap-2 pt-2" : "flex items-center gap-2";
  const btn = "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition";

  if (isAuthenticated) {
    return (
      <div className={wrap}>
        <span className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-slate-700">
          <User size={16} className="text-emerald-600" />
          <span className="max-w-[10rem] truncate">{user.name}</span>
        </span>
        <button
          type="button"
          onClick={() => { logout(); onNavigate?.(); navigate("/"); }}
          className={`${btn} border border-slate-200 text-slate-600 hover:bg-slate-50`}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <NavLink to="/login" onClick={onNavigate} className={`${btn} border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700`}>
        <LogIn size={16} /> Sign in
      </NavLink>
      <NavLink to="/register" onClick={onNavigate} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
        <UserPlus size={16} /> Register
      </NavLink>
    </div>
  );
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navItems = getNavItems(isAuthenticated);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <NavLink to="/" className="navbar__brand" onClick={closeMobile}>
            <div className="navbar__brand-icon">
              <Leaf size={21} fill="currentColor" />
            </div>
            <div className="navbar__brand-text">
              <div className="navbar__brand-name">Slay Green</div>
              <div className="navbar__brand-tagline">Live greener</div>
            </div>
          </NavLink>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="navbar__nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar__nav-link ${isActive ? "navbar__nav-link--active" : ""}`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <AuthControls />
          </div>

          <button
            className="navbar__toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="navbar__mobile">
            <div className="navbar__mobile-inner">
              <LinkItem item={{ to: "/", label: "Home", icon: HomeIcon }} onClick={closeMobile} />
              {navItems.map((item) => (
                <LinkItem key={item.to} item={item} onClick={closeMobile} />
              ))}
              {isAuthenticated && (
                <div className="max-h-[42vh] overflow-y-auto border-t border-slate-100 pt-2">
                  {FEATURE_GROUPS.map((group) => {
                    const items = FEATURE_ITEMS.filter((f) => f.group === group.name);
                    if (!items.length) return null;
                    return (
                      <div key={group.name} className="pb-2">
                        <p className="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">{group.name}</p>
                        {items.map((item) => (
                          <LinkItem key={item.to} item={item} onClick={closeMobile} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              <AuthControls stacked onNavigate={closeMobile} />
            </div>
          </nav>
        )}
      </header>

      {isAuthenticated && (
      <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar__inner">
          <div className="sidebar__header">
            {!collapsed && (
              <div>
                <p className="sidebar__header-label">Explore</p>
                <p className="sidebar__header-title">Sustainable tools</p>
              </div>
            )}
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="sidebar__collapse-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="sidebar__content">
            {FEATURE_GROUPS.map(({ name: group }) => {
              const items = FEATURE_ITEMS.filter((item) => item.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="sidebar__group">
                  {!collapsed && <p className="sidebar__group-label">{group}</p>}
                  <div className="sidebar__group-items">
                    {items.map((item) => (
                      <LinkItem key={item.to} item={item} collapsed={collapsed} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!collapsed && (
            <div className="sidebar__promo">
              <Leaf size={20} />
              <p className="sidebar__promo-title">Small choices matter.</p>
              <p className="sidebar__promo-text">
                Explore smarter, greener options for everyday decisions.
              </p>
            </div>
          )}
        </div>
      </aside>
      )}

    </>
  );
}