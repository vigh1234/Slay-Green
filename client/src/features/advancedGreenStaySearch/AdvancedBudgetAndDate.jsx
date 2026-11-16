import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedGreenStayContext } from "../../context/AdvancedGreenStayContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import BudgetDateForm from "../shared/BudgetDateForm.jsx";

export default function AdvancedBudgetAndDate() {
  const navigate = useNavigate();
  const ctx = useContext(AdvancedGreenStayContext);

  return (
    <StepScreen headerTitle="Advanced Green Stay Search" backTo={-1}>
      <BudgetDateForm
        initial={ctx}
        onNext={(vals) => {
          ctx.setLowerBudgetValue(vals.lowerBudgetValue);
          ctx.setUpperBudgetValue(vals.upperBudgetValue);
          ctx.setCurrencyValue(vals.currencyValue);
          ctx.setStartDateValue(vals.startDateValue);
          ctx.setEndDateValue(vals.endDateValue);
          navigate("/advanced-stay/travel-party");
        }}
      />
    </StepScreen>
  );
}
