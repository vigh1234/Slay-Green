import { createContext, useState } from "react";

export const ElectronicsSearchContext = createContext(null);

export function ElectronicsSearchProvider({ children }) {
  const [homeAddress, setHomeAddress] = useState(null);
  const [electronicType, setElectronicType] = useState(null);

  return (
    <ElectronicsSearchContext.Provider
      value={{ homeAddress, setHomeAddress, electronicType, setElectronicType }}
    >
      {children}
    </ElectronicsSearchContext.Provider>
  );
}
