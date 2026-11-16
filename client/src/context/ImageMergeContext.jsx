import { createContext, useState } from "react";

export const ImageMergeContext = createContext(null);

export function ImageMergeProvider({ children }) {
  const [url, setUrl] = useState(null);
  const [bodyImage, setBodyImage] = useState(null);

  return (
    <ImageMergeContext.Provider value={{ url, setUrl, bodyImage, setBodyImage }}>
      {children}
    </ImageMergeContext.Provider>
  );
}
