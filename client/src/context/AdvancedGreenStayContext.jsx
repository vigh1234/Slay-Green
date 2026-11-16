import { createContext, useState } from "react";

export const AdvancedGreenStayContext = createContext(null);

export function AdvancedGreenStayProvider({ children }) {
  const [destination2, setDestination2] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [lowerBudgetValue, setLowerBudgetValue] = useState("2000");
  const [upperBudgetValue, setUpperBudgetValue] = useState("5000");
  const [currencyValue, setCurrencyValue] = useState("₹");
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  );
  const [travelParty, setTravelParty] = useState(null);

  return (
    <AdvancedGreenStayContext.Provider
      value={{
        destination2, setDestination2,
        selectedPreferences, setSelectedPreferences,
        lowerBudgetValue, setLowerBudgetValue,
        upperBudgetValue, setUpperBudgetValue,
        currencyValue, setCurrencyValue,
        startDateValue, setStartDateValue,
        endDateValue, setEndDateValue,
        travelParty, setTravelParty,
      }}
    >
      {children}
    </AdvancedGreenStayContext.Provider>
  );
}
