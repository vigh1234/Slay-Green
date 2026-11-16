import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { ProductContext } from "../../context/ProductContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import ImageDropzone, { fileToBase64 } from "../../components/ui/ImageDropzone.jsx";
import TextField from "../../components/ui/TextField.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import Button from "../../components/ui/Button.jsx";

export default function UploadProductImage() {
  const navigate = useNavigate();
  const { setBase64Image, setProductDescription } = useContext(ProductContext);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");

  const handleFile = async (file) => {
    setPreviewUrl(URL.createObjectURL(file));
    setBase64Image(await fileToBase64(file));
  };

  const handleNext = () => {
    if (!previewUrl) return alert("Please select a product image first");
    setProductDescription(description);
    navigate("/marketplace/details");
  };

  return (
    <StepScreen headerTitle="Market Place" cartTo="/marketplace/cart" title="List a product" backTo="/">
      <ImageDropzone previewUrl={previewUrl} onFile={handleFile} label="Select product photo" />
      <div className="mt-6">
        <TextField
          label="Description (optional)"
          placeholder="A short description of your item"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <NextButton onClick={handleNext} />
      <div className="mt-4 flex justify-center">
        <Button variant="ghost" onClick={() => navigate("/marketplace/products")}>
          <ShoppingCart size={16} /> Browse existing products
        </Button>
      </div>
    </StepScreen>
  );
}
