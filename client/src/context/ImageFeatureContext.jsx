import { createContext, useState } from "react";

export const ImageFeatureContext = createContext(null);

export function ImageFeatureProvider({ children }) {
  const [base64Image, setBase64Image] = useState(null);
  const [category, setCategory] = useState(null);
  const [url, setUrl] = useState(null);
  const [bodyImage, setBodyImage] = useState(null);

  return (
    <ImageFeatureContext.Provider
      value={{ base64Image, setBase64Image, category, setCategory, url, setUrl, bodyImage, setBodyImage }}
    >
      {children}
    </ImageFeatureContext.Provider>
  );
}
