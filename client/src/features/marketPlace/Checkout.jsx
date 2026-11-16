import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import StripeCheckout from "../shared/StripeCheckout.jsx";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useContext(ProductContext);
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <StepScreen headerTitle="Market Place" title="Checkout" backTo="/marketplace/cart">
      <StripeCheckout
        amount={Math.round(total * 100)}
        currency="usd"
        intentEndpoint="/marketplace-payment-intent"
        amountLabel={`$${total.toFixed(2)}`}
        onSuccess={() => setTimeout(() => navigate("/marketplace/products"), 1500)}
      />
    </StepScreen>
  );
}
