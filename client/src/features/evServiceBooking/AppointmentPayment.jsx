import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import StripeCheckout from "../shared/StripeCheckout.jsx";

export default function AppointmentPayment() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({ name: "", address: "", phone: "", email: "" });
  const [confirmed, setConfirmed] = useState(false);

  const set = (key) => (e) => setDetails((prev) => ({ ...prev, [key]: e.target.value }));
  const ready = details.name && details.address && details.phone && details.email;

  return (
    <StepScreen headerTitle="EV Services Booking" title="Appointment payment" backTo={-1}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Name" value={details.name} onChange={set("name")} placeholder="Full name" />
        <TextField label="Phone" value={details.phone} onChange={set("phone")} placeholder="Phone number" />
        <TextField label="Email" type="email" value={details.email} onChange={set("email")} placeholder="Email" />
        <TextField label="Address" value={details.address} onChange={set("address")} placeholder="Service address" />
      </div>
      <div className="mt-8">
        {ready ? (
          <StripeCheckout
            amount={5000}
            currency="usd"
            amountLabel="$50.00 (service fee)"
            onSuccess={() => {
              setConfirmed(true);
              setTimeout(() => navigate("/ev-services/confirmation"), 800);
            }}
          />
        ) : (
          <p className="text-center text-sm text-slate-400">Fill in your details above to continue to payment.</p>
        )}
        {confirmed && <p className="mt-3 text-center text-sm font-semibold text-emerald-700">Redirecting...</p>}
      </div>
    </StepScreen>
  );
}
