import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Users, Building2 } from "lucide-react";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Button from "../../components/ui/Button.jsx";

export default function ProductList() {
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  return (
    <StepScreen headerTitle="Market Place" cartTo="/marketplace/cart" title="Available Products" backTo="/marketplace">
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-sm text-slate-400">No products listed yet</p>
          <Button onClick={() => navigate("/marketplace")}>List the first product</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/marketplace/product/${item.id}`)}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src={`data:image/png;base64,${item.image}`} alt={item.name} className="h-28 w-full bg-slate-100 object-cover" />
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-sm font-bold text-emerald-600">${item.price}</p>
                <p className="truncate text-xs italic text-slate-400">{item.category || "Not specified"}</p>
                <div className="mt-1 space-y-0.5 rounded-lg bg-slate-50 p-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500"><Leaf size={11} className="text-emerald-600" /> Env</span>
                    <span className="font-bold text-slate-700">{item.esgScores?.EnvironmentScore ?? "--"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500"><Users size={11} className="text-blue-600" /> Soc</span>
                    <span className="font-bold text-slate-700">{item.esgScores?.SocietalScore ?? "--"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500"><Building2 size={11} className="text-amber-600" /> Gov</span>
                    <span className="font-bold text-slate-700">{item.esgScores?.GovernanceScore ?? "--"}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </StepScreen>
  );
}
