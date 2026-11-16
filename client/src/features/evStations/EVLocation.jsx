import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EVStationContext } from "../../context/EVStationContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import DestinationForm from "../shared/DestinationForm.jsx";

export default function EVLocation() {
  const navigate = useNavigate();
  const { stationLocation, setStationLocation } = useContext(EVStationContext);

  return (
    <StepScreen headerTitle="EV Stations" backTo="/">
      <DestinationForm
        initial={stationLocation}
        label="Where are you looking for a charging station?"
        onNext={(val) => {
          setStationLocation(val);
          navigate("/ev-stations/options");
        }}
      />
    </StepScreen>
  );
}
