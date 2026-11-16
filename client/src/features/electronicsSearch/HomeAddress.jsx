import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ElectronicsSearchContext } from "../../context/ElectronicsSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import DestinationForm from "../shared/DestinationForm.jsx";

export default function HomeAddress() {
  const navigate = useNavigate();
  const { homeAddress, setHomeAddress } = useContext(ElectronicsSearchContext);

  return (
    <StepScreen headerTitle="Consumer Electronics" backTo="/">
      <DestinationForm
        initial={homeAddress || ""}
        label="What's your home address?"
        onNext={(val) => {
          setHomeAddress(val);
          navigate("/electronics/type");
        }}
      />
    </StepScreen>
  );
}
