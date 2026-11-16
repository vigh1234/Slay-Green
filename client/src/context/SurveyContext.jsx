import { createContext, useState } from "react";

export const SurveyContext = createContext(null);

const fields = [
  "emailId", "zipcodeValue", "countryName", "stateName", "cityName",
  "temperatureValue", "selectedPeopleValue", "houseHoldIncomeValue",
  "numberOfVehicleValue", "averageDistanceValue", "totalDistanceValue",
  "airTravelValue", "electricityBillValue", "cleanEnergyBillValue",
  "gasBillValue", "heatingOilBillValue", "areaValue", "waterBillValue",
  "meatCaloriesValue", "grainsCaloriesValue", "dairyCaloriesValue",
  "fruitsCaloriesValue", "snacksCaloriesValue", "appliancesSpendingValue",
  "clothSpendingValue", "entertainmentSpendingValue", "readingSpendingValue",
  "cleaningSpendingValue", "autoSpendingValue", "medicalSpendingValue",
  "healthSpendingValue", "communicationSpendingValue", "businessSpendingValue",
  "maintenanceSpendingValue", "charitySpendingValue", "otherSpendingValue",
];

export function SurveyProvider({ children }) {
  const [state, setState] = useState(
    Object.fromEntries(fields.map((f) => [f, f === "airTravelValue" ? {} : ""]))
  );

  const value = { ...state };
  fields.forEach((f) => {
    const setterName = `set${f[0].toUpperCase()}${f.slice(1)}`;
    value[setterName] = (v) => setState((prev) => ({ ...prev, [f]: v }));
  });

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}
