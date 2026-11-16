import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Button from "../../components/ui/Button.jsx";
import ScoreList from "../../components/ui/ScoreList.jsx";

export default function ProductView() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useContext(ProductContext);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <StepScreen headerTitle="Market Place" backTo="/marketplace/products" title="Product not found">
        <Button onClick={() => navigate("/marketplace/products")}>Back to products</Button>
      </StepScreen>
    );
  }

  return (
    <StepScreen headerTitle="Market Place" cartTo="/marketplace/cart" backTo="/marketplace/products">
      <img src={`data:image/png;base64,${product.image}`} alt={product.name} className="mx-auto mb-6 max-h-72 rounded-2xl object-contain" />
      <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
      <p className="mb-1 text-sm text-slate-400">{product.category}</p>
      <p className="mb-6 text-2xl font-extrabold text-emerald-600">${product.price}</p>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">ESG Scores</h3>
      <ScoreList scores={product.esgScores} />
      <div className="mt-8 flex justify-center">
        <Button
          className="w-full max-w-xs"
          onClick={() => {
            addToCart(product);
            navigate("/marketplace/cart");
          }}
        >
          Add to Cart
        </Button>
      </div>
    </StepScreen>
  );
}
