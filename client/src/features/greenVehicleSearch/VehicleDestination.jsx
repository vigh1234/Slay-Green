import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GreenVehicleSearchContext } from "../../context/GreenVehicleSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import DestinationForm from "../shared/DestinationForm.jsx";

export default function VehicleDestination() {
  const navigate = useNavigate();
  const { destination1, setDestination1 } = useContext(GreenVehicleSearchContext);

  return (
    <StepScreen headerTitle="Green Vehicle Search" backTo="/">
      <DestinationForm
        initial={destination1}
        label="Where do you need the vehicle?"
        onNext={(val) => {
          setDestination1(val);
          navigate("/green-vehicle/type");
        }}
      />
    </StepScreen>
  );
}
