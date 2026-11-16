import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Wrench, PlugZap, Wind } from "lucide-react";
import { AdvancedGreenVehicleContext } from "../../context/AdvancedGreenVehicleContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import OptionGridPicker from "../shared/OptionGridPicker.jsx";

const OPTIONS = [
  { value: "All-Electric Vehicles", label: "All-Electric Vehicles", icon: Zap },
  { value: "Hybrid Electric Vehicles", label: "Hybrid Electric Vehicles", icon: Wrench },
  { value: "Plug-in Hybrid Electric Vehicles", label: "Plug-in Hybrid Electric Vehicles", icon: PlugZap },
  { value: "Zero-Emission Vehicles", label: "Zero-Emission Vehicles", icon: Wind },
];

export default function AdvancedVehicleOption() {
  const navigate = useNavigate();
  const { setSelectedVehicle } = useContext(AdvancedGreenVehicleContext);

  return (
    <StepScreen headerTitle="Advanced Green Vehicle Search" backTo={-1}>
      <OptionGridPicker
        title="Choose vehicle energy type"
        groups={[{ options: OPTIONS }]}
        buttonLabel="Finish"
        onNext={(val) => {
          setSelectedVehicle(val);
          navigate("/advanced-vehicle/recommendations");
        }}
      />
    </StepScreen>
  );
}
