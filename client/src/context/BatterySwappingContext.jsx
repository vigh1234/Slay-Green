import { createContext, useState } from "react";

export const BatterySwappingContext = createContext(null);

export function BatterySwappingProvider({ children }) {
  const [location1, setLocation1] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [companyLocations, setCompanyLocations] = useState({ company: "", location: "" });

  return (
    <BatterySwappingContext.Provider
      value={{ location1, setLocation1, vehicleType, setVehicleType, companyLocations, setCompanyLocations }}
    >
      {children}
    </BatterySwappingContext.Provider>
  );
}
