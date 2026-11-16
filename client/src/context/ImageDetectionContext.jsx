import { createContext, useState } from "react";

export const ImageDetectionContext = createContext(null);

export function ImageDetectionProvider({ children }) {
  const [base64Image, setBase64Image] = useState(null);
  const [category, setCategory] = useState(null);

  return (
    <ImageDetectionContext.Provider value={{ base64Image, setBase64Image, category, setCategory }}>
      {children}
    </ImageDetectionContext.Provider>
  );
}
