import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GreenStaySearchContext } from "../../context/GreenStaySearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import DestinationForm from "../shared/DestinationForm.jsx";

export default function Destination() {
  const navigate = useNavigate();
  const { destination, setDestination } = useContext(GreenStaySearchContext);

  return (
    <StepScreen headerTitle="Green Stay Search" backTo="/">
      <DestinationForm
        initial={destination}
        label="Where would you like an eco-friendly stay?"
        onNext={(val) => {
          setDestination(val);
          navigate("/green-stay/budget");
        }}
      />
    </StepScreen>
  );
}
