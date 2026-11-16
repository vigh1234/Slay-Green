import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BatterySwappingContext } from "../../context/BatterySwappingContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import DestinationForm from "../shared/DestinationForm.jsx";

export default function Location() {
  const navigate = useNavigate();
  const { location1, setLocation1 } = useContext(BatterySwappingContext);

  return (
    <StepScreen headerTitle="Battery Swapping Centers" backTo="/">
      <DestinationForm
        initial={location1}
        label="Where are you looking for a swap?"
        onNext={(val) => {
          setLocation1(val);
          navigate("/battery-swapping/vehicle-type");
        }}
      />
    </StepScreen>
  );
}
