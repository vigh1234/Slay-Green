import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../components/layout/NavBar.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  // Start every page at the top when navigating.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // The tools sidebar only exists for signed-in users, so only they need the offset.
  const offset = isAuthenticated ? "lg:pl-[280px]" : "";

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-800">
      <NavBar />
      <main className={`min-h-[calc(100vh-72px)] ${offset}`}>
        <Outlet />
      </main>
      <div className={offset}>
        <Footer />
      </div>
    </div>
  );
}
