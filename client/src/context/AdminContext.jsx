import { createContext, useState } from "react";

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [selectedServiceProviders, setSelectedServiceProviders] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <AdminContext.Provider
      value={{ selectedServiceProviders, setSelectedServiceProviders, isAdminAuthenticated, setIsAdminAuthenticated }}
    >
      {children}
    </AdminContext.Provider>
  );
}
