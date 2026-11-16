import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, Car, CarFront, Truck, Bus } from "lucide-react";
import { GreenVehicleSearchContext } from "../../context/GreenVehicleSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import OptionGridPicker from "../shared/OptionGridPicker.jsx";

const GROUPS = [
  {
    label: "Personal Vehicle",
    options: [
      { value: "2-Wheeler", label: "Two Wheeler", icon: Bike },
      { value: "4-Wheeler", label: "Four Wheeler", icon: CarFront },
    ],
  },
  {
    label: "Commercial Vehicle",
    options: [
      { value: "Car", label: "Car", icon: Car },
      { value: "3-Wheeler", label: "3 Wheeler", icon: Bike },
      { value: "Goods", label: "Goods Vehicle", icon: Truck },
      { value: "Bus", label: "Bus", icon: Bus },
    ],
  },
];

export default function VehicleType() {
  const navigate = useNavigate();
  const { setSelectedVehicle1 } = useContext(GreenVehicleSearchContext);

  return (
    <StepScreen headerTitle="Green Vehicle Search" backTo={-1}>
      <OptionGridPicker
        title="Choose a vehicle type"
        groups={GROUPS}
        onNext={(val) => {
          setSelectedVehicle1(val);
          navigate("/green-vehicle/option");
        }}
      />
    </StepScreen>
  );
}
