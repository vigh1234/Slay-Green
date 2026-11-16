import { createContext, useState } from "react";

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [base64Image, setBase64Image] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [cart, setCart] = useState([]);

  const addProduct = (product) => setProducts((prev) => [...prev, product]);
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  return (
    <ProductContext.Provider
      value={{
        products, addProduct,
        cart, addToCart, removeFromCart,
        base64Image, setBase64Image,
        productDescription, setProductDescription,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
