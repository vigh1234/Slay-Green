import { useContext, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ImageMergeContext } from "../../context/ImageMergeContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { api } from "../../api/client.js";

export default function TryOnImage() {
  const { url, bodyImage } = useContext(ImageMergeContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const bodyImageBase64 = (bodyImage || "").split(",")[1];
      const data = await api.post("/merge-clothing-esg", {
        bodyImageBase64,
        amazonUrl: url,
        clothingType: "shirt",
      });
      if (!data.success) throw new Error(data.error || "Try-on failed");
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Could not complete the virtual try-on.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url && bodyImage) run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StepScreen headerTitle="Cloth Try-On" title="Your Try-On Result" backTo={-1}>
      {loading && <Loader label="Merging clothing with your photo — this can take a moment..." />}
      {error && <ErrorState message={error} onRetry={run} />}
      {!loading && !error && result && (
        <div className="space-y-6">
          <img
            src={`data:image/png;base64,${result.imageBase64}`}
            alt="Try-on result"
            className="mx-auto max-h-96 rounded-2xl border border-slate-200 object-contain shadow-card"
          />
          {result.productDetails && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <h3 className="mb-2 text-sm font-bold text-slate-900">{result.productDetails.title}</h3>
              <p className="text-sm text-slate-600">Price: {result.productDetails.price}</p>
              {url && (
                <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
                  View original listing <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </StepScreen>
  );
}
