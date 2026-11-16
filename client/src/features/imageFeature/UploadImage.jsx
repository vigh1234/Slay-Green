import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageFeatureContext } from "../../context/ImageFeatureContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import ImageDropzone, { fileToBase64 } from "../../components/ui/ImageDropzone.jsx";
import TextField from "../../components/ui/TextField.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

export default function UploadImage() {
  const navigate = useNavigate();
  const { setUrl, setBodyImage, setBase64Image } = useContext(ImageFeatureContext);
  const [link, setLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64, setBase64] = useState(null);

  const handleFile = async (file) => {
    setPreviewUrl(URL.createObjectURL(file));
    const b64 = await fileToBase64(file);
    setBase64(b64);
  };

  const handleNext = () => {
    if (!previewUrl) return alert("Please select a body image first!");
    setBase64Image(base64);
    setBodyImage(`data:image/png;base64,${base64}`);

    if (link) {
      // A product link was provided: head into the AI clothing try-on flow.
      setUrl(link);
      navigate("/image-features/try-on");
    } else {
      // No link: fall back to plain ESG image analysis of the uploaded photo.
      navigate("/image-features/category");
    }
  };

  return (
    <StepScreen headerTitle="Image Features" title="Virtual Clothing Try-On" backTo="/">
      <ImageDropzone previewUrl={previewUrl} onFile={handleFile} label="Select body image" hint="A clear, front-facing photo works best" />
      <div className="mt-6">
        <TextField
          label="Amazon clothing link (optional)"
          placeholder="Paste an Amazon product link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <p className="mt-2 text-xs text-slate-400">
          Add a link to virtually try on that item. Leave it blank to just analyze your photo's ESG score.
        </p>
      </div>
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
