import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedGreenStayContext } from "../../context/AdvancedGreenStayContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TravelPartyPicker from "../shared/TravelPartyPicker.jsx";

export default function AdvancedTravelParty() {
  const navigate = useNavigate();
  const { setTravelParty } = useContext(AdvancedGreenStayContext);

  return (
    <StepScreen headerTitle="Advanced Green Stay Search" backTo={-1}>
      <TravelPartyPicker
        onNext={(val) => {
          setTravelParty(val);
          navigate("/advanced-stay/recommendations");
        }}
      />
    </StepScreen>
  );
}
