import { createContext, useState } from "react";

export const GreenStaySearchContext = createContext(null);

export function GreenStaySearchProvider({ children }) {
  const [destination, setDestination] = useState("");
  const [lowerBudgetValue, setLowerBudgetValue] = useState("2000");
  const [upperBudgetValue, setUpperBudgetValue] = useState("5000");
  const [currencyValue, setCurrencyValue] = useState("₹");
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  );
  const [travelParty, setTravelParty] = useState(null);

  return (
    <GreenStaySearchContext.Provider
      value={{
        destination, setDestination,
        lowerBudgetValue, setLowerBudgetValue,
        upperBudgetValue, setUpperBudgetValue,
        currencyValue, setCurrencyValue,
        startDateValue, setStartDateValue,
        endDateValue, setEndDateValue,
        travelParty, setTravelParty,
      }}
    >
      {children}
    </GreenStaySearchContext.Provider>
  );
}
