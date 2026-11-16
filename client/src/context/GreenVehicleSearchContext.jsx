import { createContext, useState } from "react";

export const GreenVehicleSearchContext = createContext(null);

export function GreenVehicleSearchProvider({ children }) {
  const [destination1, setDestination1] = useState("");
  const [selectedVehicle1, setSelectedVehicle1] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  return (
    <GreenVehicleSearchContext.Provider
      value={{
        destination1, setDestination1,
        selectedVehicle1, setSelectedVehicle1,
        selectedVehicle, setSelectedVehicle,
      }}
    >
      {children}
    </GreenVehicleSearchContext.Provider>
  );
}
