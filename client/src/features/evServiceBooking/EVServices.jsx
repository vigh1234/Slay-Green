import { useNavigate } from "react-router-dom";
import { BatteryCharging, Wrench, Truck, Zap } from "lucide-react";
import StepScreen from "../../components/layout/StepScreen.jsx";
import OptionGridPicker from "../shared/OptionGridPicker.jsx";

const OPTIONS = [
  { value: "Battery Swapping Center", label: "Battery Swapping", icon: BatteryCharging },
  { value: "Restoration", label: "Restoration", icon: Wrench },
  { value: "Tow", label: "Tow", icon: Truck },
  { value: "Battery recharge", label: "Battery Recharge", icon: Zap },
];

export default function EVServices() {
  const navigate = useNavigate();

  return (
    <StepScreen headerTitle="EV Services Booking" title="Choose a service type" backTo="/">
      <OptionGridPicker groups={[{ options: OPTIONS }]} onNext={() => navigate("/ev-services/providers")} />
    </StepScreen>
  );
}
