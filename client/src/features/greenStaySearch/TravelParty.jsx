import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GreenStaySearchContext } from "../../context/GreenStaySearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TravelPartyPicker from "../shared/TravelPartyPicker.jsx";

export default function TravelParty() {
  const navigate = useNavigate();
  const { setTravelParty } = useContext(GreenStaySearchContext);

  return (
    <StepScreen headerTitle="Green Stay Search" backTo={-1}>
      <TravelPartyPicker
        onNext={(val) => {
          setTravelParty(val);
          navigate("/green-stay/recommendations");
        }}
      />
    </StepScreen>
  );
}
