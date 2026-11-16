import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useContext(ProductContext);
  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <StepScreen headerTitle="Market Place" title="Your Cart" backTo="/marketplace/products">
      {cart.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-sm text-slate-400">Your cart is empty</p>
          <Button onClick={() => navigate("/marketplace/products")}>Browse products</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
              <img src={`data:image/png;base64,${item.image}`} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-sm font-bold text-emerald-600">${item.price}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-semibold text-slate-500">Total</span>
            <span className="text-lg font-extrabold text-slate-900">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/marketplace/products")}>
              Keep shopping
            </Button>
            <Button className="flex-1" onClick={() => navigate("/marketplace/checkout")}>
              Checkout
            </Button>
          </div>
        </div>
      )}
    </StepScreen>
  );
}
