import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageMergeContext } from "../../context/ImageMergeContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import ImageDropzone, { fileToBase64 } from "../../components/ui/ImageDropzone.jsx";
import TextField from "../../components/ui/TextField.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

export default function ImageExtraction() {
  const navigate = useNavigate();
  const { setUrl, setBodyImage } = useContext(ImageMergeContext);
  const [link, setLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64, setBase64] = useState(null);

  const handleFile = async (file) => {
    setPreviewUrl(URL.createObjectURL(file));
    setBase64(await fileToBase64(file));
  };

  const handleNext = () => {
    if (!previewUrl || !link) {
      alert("Please select a body image and paste a clothing link");
      return;
    }
    setUrl(link);
    setBodyImage(`data:image/png;base64,${base64}`);
    navigate("/cloth-try-on/result");
  };

  return (
    <StepScreen headerTitle="Cloth Try-On" title="Virtual Clothing Try-On" backTo="/">
      <ImageDropzone previewUrl={previewUrl} onFile={handleFile} label="Select body image" />
      <div className="mt-6">
        <TextField
          label="Amazon clothing link"
          placeholder="Paste an Amazon product link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
