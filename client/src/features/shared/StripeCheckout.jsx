import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { api } from "../../api/client.js";

/**
 * Web equivalent of the RN app's Stripe PaymentSheet / react-native-stripe
 * Google Pay button: Stripe Elements' PaymentElement renders a full card
 * form, and PaymentRequestButtonElement surfaces the browser's native
 * Google Pay / Apple Pay sheet when the device supports it — the closest
 * web analogue to `@stripe/stripe-react-native`'s presentPaymentSheet.
 */
function InnerForm({ amountLabel, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!stripe) return;
    // Amount is baked into the PaymentIntent already created on the server;
    // Stripe just needs a rough display amount for the native sheet UI.
    const pr = stripe.paymentRequest({
      country: "IN",
      currency: "inr",
      total: { label: "Slay Green", amount: 0 },
      requestPayerName: true,
    });
    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError("");
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
      return;
    }
    setDone(true);
    setSubmitting(false);
    onSuccess?.();
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 size={40} className="text-emerald-600" />
        <p className="font-bold text-slate-900">Payment successful!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {paymentRequest && (
        <div>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" /> or pay with card <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>
      )}
      <PaymentElement />
      {amountLabel && <p className="text-right text-sm text-slate-500">Total: {amountLabel}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={!stripe || submitting} className="w-full">
        {submitting ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}

/**
 * @param {number} amount - amount in the smallest currency unit (e.g. paise)
 * @param {string} currency - e.g. "inr"
 * @param {string} intentEndpoint - backend endpoint that creates the PaymentIntent
 * @param {string} amountLabel - human-readable amount for display
 */
export default function StripeCheckout({ amount, currency = "inr", intentEndpoint = "/create-payment-intent", amountLabel, onSuccess }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const init = async () => {
    setLoading(true);
    setError("");
    try {
      const { publishableKey } = await api.get("/stripe-key");
      if (!publishableKey) throw new Error("Stripe is not configured on the server.");
      setStripePromise(loadStripe(publishableKey));

      const { clientSecret } = await api.post(intentEndpoint, { amount, currency });
      if (!clientSecret) throw new Error("Could not start checkout.");
      setClientSecret(clientSecret);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Could not initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount > 0) init();
  }, [amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const options = useMemo(() => (clientSecret ? { clientSecret } : null), [clientSecret]);

  if (loading) return <Loader label="Setting up secure checkout..." />;
  if (error) return <ErrorState message={error} onRetry={init} />;
  if (!stripePromise || !options) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerForm amountLabel={amountLabel} onSuccess={onSuccess} />
    </Elements>
  );
}
