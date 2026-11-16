import { useContext, useEffect, useState } from "react";
import { ImageFeatureContext } from "../../context/ImageFeatureContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import ScoreList from "../../components/ui/ScoreList.jsx";
import { api } from "../../api/client.js";
import { parseKeyValueText } from "../../lib/parseKeyValueText.js";

export default function ImageAnalysis() {
  const { base64Image, category } = useContext(ImageFeatureContext);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.post("/analyze-image", {
        base64Image,
        prompt: `Hello, please identify the item in this image. Most probably this image is from ${category} category.
        Provide the scores as follows:
        Environment Score, Societal Score, Governance Score, and Wallet-Friendly Score on a percentage scale.
        Additionally, include the item name, category, model number, version number, and a detailed description.
        Format the response as:
        Environment Score: X%
        Societal Score: Y%
        Governance Score: Z%
        Wallet-Friendly Score: W%
        Item Name: Name
        Item Category: Category
        Model Number: Number
        Version Number: Version
        Description: A brief description of the item and its features.
        Please ensure each score and record does not start with "##" and provide no additional text.`,
      });
      setScores(parseKeyValueText(data.text));
    } catch (err) {
      setError(err?.response?.data?.error || "Could not analyze this image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyze();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StepScreen headerTitle="Image Features" title="Item details" backTo={-1}>
      {base64Image && (
        <img src={`data:image/png;base64,${base64Image}`} alt="Uploaded" className="mx-auto mb-6 max-h-56 rounded-xl object-contain" />
      )}
      {loading && <Loader label="Analyzing your image..." />}
      {error && <ErrorState message={error} onRetry={analyze} />}
      {!loading && !error && <ScoreList scores={scores} />}
    </StepScreen>
  );
}
