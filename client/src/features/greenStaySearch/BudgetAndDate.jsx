import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GreenStaySearchContext } from "../../context/GreenStaySearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import BudgetDateForm from "../shared/BudgetDateForm.jsx";

export default function BudgetAndDate() {
  const navigate = useNavigate();
  const ctx = useContext(GreenStaySearchContext);

  return (
    <StepScreen headerTitle="Green Stay Search" backTo={-1}>
      <BudgetDateForm
        initial={ctx}
        onNext={(vals) => {
          ctx.setLowerBudgetValue(vals.lowerBudgetValue);
          ctx.setUpperBudgetValue(vals.upperBudgetValue);
          ctx.setCurrencyValue(vals.currencyValue);
          ctx.setStartDateValue(vals.startDateValue);
          ctx.setEndDateValue(vals.endDateValue);
          navigate("/green-stay/travel-party");
        }}
      />
    </StepScreen>
  );
}
