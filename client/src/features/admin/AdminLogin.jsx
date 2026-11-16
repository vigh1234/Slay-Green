import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import { api } from "../../api/client.js";

/**
 * The original RN screen checked a hardcoded email/password pair on the
 * client. That's a real security anti-pattern (credentials ship inside the
 * app bundle), so here the check is moved server-side: the backend compares
 * against ADMIN_EMAIL / ADMIN_PASSWORD env vars (see server/controllers/
 * adminAuthController.js) and this screen never sees the real credentials.
 * This is still a very lightweight gate, not full authentication — fine for
 * an internal admin toggle screen, but swap in real auth before shipping.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { setIsAdminAuthenticated } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/admin/login", { email, password });
      setIsAdminAuthenticated(true);
      navigate("/admin/battery-swapping");
    } catch (err) {
      setError(err?.response?.data?.error || "Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepScreen headerTitle="Admin Login" title="Admin Login" backTo="/">
      <div className="mx-auto max-w-sm space-y-4">
        <TextField label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="Email" />
        <TextField label="Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Password" />
        {error && <p className="text-center text-sm font-semibold text-red-500">{error}</p>}
        <NextButton onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</NextButton>
      </div>
    </StepScreen>
  );
}
