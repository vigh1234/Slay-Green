import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Users, Building2, DollarSign } from "lucide-react";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import { api } from "../../api/client.js";
import { parseKeyValueText } from "../../lib/parseKeyValueText.js";
import { PRODUCT_CATEGORIES } from "../shared/productCategories.js";

const SCORE_ROWS = [
  { key: "EnvironmentScore", label: "Environment Score", icon: Leaf, color: "text-emerald-600" },
  { key: "SocietalScore", label: "Societal Score", icon: Users, color: "text-blue-600" },
  { key: "GovernanceScore", label: "Governance Score", icon: Building2, color: "text-amber-600" },
  { key: "WalletFriendlyScore", label: "Wallet-Friendly Score", icon: DollarSign, color: "text-orange-600" },
];

export default function ProductDetails() {
  const navigate = useNavigate();
  const { base64Image, addProduct } = useContext(ProductContext);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const analyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.post("/esg-analyze", {
        base64Image,
        prompt: `Hello, please identify the item in this image.
          Provide the scores as follows:
          Environment Score, Societal Score, Governance Score, and Wallet-Friendly Score on a percentage scale.
          Format the response as:
          Environment Score: X%
          Societal Score: Y%
          Governance Score: Z%
          Wallet-Friendly Score: W%
          Just give the above scores only, no need of any additional descriptions`,
      });
      setScores(parseKeyValueText(data.text));
    } catch (err) {
      setError(err?.response?.data?.error || "Could not analyze this product image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyze();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (!name || !price || !category) return alert("Please fill all fields");
    addProduct({
      id: Date.now().toString(),
      name,
      price: Number(price),
      category,
      image: base64Image,
      esgScores: scores,
    });
    navigate("/marketplace/products");
  };

  return (
    <StepScreen headerTitle="Market Place" title="Product ESG Analysis" backTo={-1}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          {base64Image && (
            <img src={`data:image/png;base64,${base64Image}`} alt="Product" className="mb-4 max-h-56 w-full rounded-xl object-contain" />
          )}
          {loading && <Loader label="Analyzing..." />}
          {error && <ErrorState message={error} onRetry={analyze} />}
          {!loading && !error && (
            <div className="space-y-2">
              {SCORE_ROWS.map((row) => (
                <div key={row.key} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <row.icon size={16} className={row.color} />
                  <span className="text-slate-600">{row.label}:</span>
                  <span className="font-bold text-slate-900">{scores[row.key] || "N/A"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <TextField label="Product name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
          <TextField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
      </div>
      <NextButton onClick={handleSubmit}>List product</NextButton>
    </StepScreen>
  );
}
