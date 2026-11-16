import { createContext, useState } from "react";

export const AdvancedGreenVehicleContext = createContext(null);

export function AdvancedGreenVehicleProvider({ children }) {
  const [destination3, setDestination3] = useState("");
  const [selectedPreferences1, setSelectedPreferences1] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedVehicle1, setSelectedVehicle1] = useState("");

  return (
    <AdvancedGreenVehicleContext.Provider
      value={{
        destination3, setDestination3,
        selectedPreferences1, setSelectedPreferences1,
        selectedVehicle, setSelectedVehicle,
        selectedVehicle1, setSelectedVehicle1,
      }}
    >
      {children}
    </AdvancedGreenVehicleContext.Provider>
  );
}
