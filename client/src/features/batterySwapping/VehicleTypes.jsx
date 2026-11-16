import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, Rocket } from "lucide-react";
import { BatterySwappingContext } from "../../context/BatterySwappingContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import OptionGridPicker from "../shared/OptionGridPicker.jsx";

const OPTIONS = [
  { value: "2-Wheeler", label: "2 Wheeler", icon: Bike },
  { value: "3-Wheeler", label: "3 Wheeler", icon: Rocket },
];

export default function VehicleTypes() {
  const navigate = useNavigate();
  const { setVehicleType } = useContext(BatterySwappingContext);

  return (
    <StepScreen headerTitle="Battery Swapping Centers" backTo={-1}>
      <OptionGridPicker
        title="Choose a vehicle type"
        groups={[{ options: OPTIONS }]}
        buttonLabel="Next"
        onNext={(val) => {
          setVehicleType(val);
          navigate("/battery-swapping/company");
        }}
      />
    </StepScreen>
  );
}
