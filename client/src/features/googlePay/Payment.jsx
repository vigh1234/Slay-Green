import { useState } from "react";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import StripeCheckout from "../shared/StripeCheckout.jsx";

/**
 * Web equivalent of the RN app's GooglePay/Payment screen. On mobile that
 * screen used @stripe/stripe-react-native's native PaymentSheet; on the web
 * the closest equivalent — including an actual Google Pay button where the
 * browser supports it — is Stripe's PaymentRequestButtonElement, bundled
 * into the shared StripeCheckout component.
 */
export default function Payment() {
  const [amount, setAmount] = useState("10.00");
  const cents = Math.round(parseFloat(amount || "0") * 100);

  return (
    <StepScreen headerTitle="Payment" title="Quick Payment" backTo="/">
      <div className="mb-6 max-w-xs">
        <TextField
          label="Amount (INR)"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {cents > 0 && <StripeCheckout amount={cents} currency="inr" amountLabel={`₹${amount}`} />}
    </StepScreen>
  );
}
