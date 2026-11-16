import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageDetectionContext } from "../../context/ImageDetectionContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import ImageDropzone, { fileToBase64 } from "../../components/ui/ImageDropzone.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

export default function ImageDetection() {
  const navigate = useNavigate();
  const { setBase64Image } = useContext(ImageDetectionContext);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = async (file) => {
    setPreviewUrl(URL.createObjectURL(file));
    const base64 = await fileToBase64(file);
    setBase64Image(base64);
  };

  const handleNext = () => {
    if (!previewUrl) return alert("Please select an image first!");
    navigate("/scan-image/category");
  };

  return (
    <StepScreen headerTitle="Scan Image" title="Upload image to see details" backTo="/">
      <ImageDropzone previewUrl={previewUrl} onFile={handleFile} hint="PNG or JPG" />
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
