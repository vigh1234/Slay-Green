import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Button from "../../components/ui/Button.jsx";

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <StepScreen headerTitle="EV Services Booking" backTo="/">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 size={80} className="text-emerald-600" />
        <h1 className="text-2xl font-bold text-emerald-600">Payment Successful!</h1>
        <p className="max-w-xs text-sm text-slate-500">
          Thank you for your payment. Your appointment is confirmed.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">Go to Home</Button>
      </div>
    </StepScreen>
  );
}
