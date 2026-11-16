import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Tv, Laptop, Refrigerator, WashingMachine, Wind, Microwave } from "lucide-react";
import { ElectronicsSearchContext } from "../../context/ElectronicsSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import OptionGridPicker from "../shared/OptionGridPicker.jsx";

const OPTIONS = [
  { value: "Energy-efficient TVs", label: "TVs", icon: Tv },
  { value: "Energy-efficient laptops", label: "Laptops", icon: Laptop },
  { value: "Energy-efficient refrigerators", label: "Refrigerators", icon: Refrigerator },
  { value: "Energy-efficient washing machines", label: "Washing Machines", icon: WashingMachine },
  { value: "Energy-efficient air conditioners", label: "Air Conditioners", icon: Wind },
  { value: "Energy-efficient microwaves", label: "Microwaves", icon: Microwave },
];

export default function ElectronicType() {
  const navigate = useNavigate();
  const { setElectronicType } = useContext(ElectronicsSearchContext);

  return (
    <StepScreen headerTitle="Consumer Electronics" backTo={-1}>
      <OptionGridPicker
        title="Choose an electronics category"
        groups={[{ options: OPTIONS }]}
        buttonLabel="Finish"
        onNext={(val) => {
          setElectronicType(val);
          navigate("/electronics/recommendations");
        }}
      />
    </StepScreen>
  );
}
