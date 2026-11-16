import { createContext, useState } from "react";

export const EVStationContext = createContext(null);

export function EVStationProvider({ children }) {
  const [stationLocation, setStationLocation] = useState("");
  const [selectedEV, setSelectedEV] = useState("");

  return (
    <EVStationContext.Provider
      value={{ stationLocation, setStationLocation, selectedEV, setSelectedEV }}
    >
      {children}
    </EVStationContext.Provider>
  );
}
