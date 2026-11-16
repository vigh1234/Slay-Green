import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import { api } from "../../api/client.js";

const PROVIDERS = ["Yuma Energy", "Honda Eswap", "BPCL E-Drive"];
const FEATURES = [
  "Green stay search", "Green vehicle search", "Advanced green stay search",
  "Advanced green vehicle search", "Scan image", "Green electronics search",
  "EV service booking", "Market place", "Video search", "EV stations", "Cloth Try on",
];

export default function BatterySwappingAdminPage() {
  const navigate = useNavigate();
  const { setSelectedServiceProviders } = useContext(AdminContext);
  const [country, setCountry] = useState("India");
  const [providers, setProviders] = useState({});
  const [features, setFeatures] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleConfirm = async () => {
    const selected = Object.keys(providers).filter((p) => providers[p]);
    if (selected.length === 0) {
      setError("Please select at least one service provider.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/selected-service-providers", { providers: selected, country });
      setSelectedServiceProviders(selected);
      navigate("/scan-image");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send providers to backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepScreen headerTitle="Admin" title="Admin Settings" backTo="/admin">
      <div className="mx-auto max-w-lg space-y-8">
        <div>
          <Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </Select>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Battery swapping providers</h3>
          <div className="space-y-2">
            {PROVIDERS.map((p) => (
              <label key={p} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
                <span className="text-sm font-semibold text-slate-700">{p}</span>
                <input type="checkbox" checked={!!providers[p]} onChange={() => toggle(setProviders, p)} className="h-4 w-4 accent-emerald-600" />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Enabled app features</h3>
          <div className="space-y-2">
            {FEATURES.map((f) => (
              <label key={f} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
                <span className="text-sm font-semibold text-slate-700">{f}</span>
                <input type="checkbox" checked={!!features[f]} onChange={() => toggle(setFeatures, f)} className="h-4 w-4 accent-emerald-600" />
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-center text-sm font-semibold text-red-500">{error}</p>}
        <NextButton onClick={handleConfirm} disabled={saving}>{saving ? "Saving..." : "Confirm"}</NextButton>
      </div>
    </StepScreen>
  );
}
