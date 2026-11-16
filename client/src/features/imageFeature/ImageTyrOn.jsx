import { useContext, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ImageFeatureContext } from "../../context/ImageFeatureContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { api } from "../../api/client.js";

/**
 * Virtual try-on: sends the shopper's photo + an Amazon product link to the
 * backend, which scrapes the product image, removes its background, composites
 * it onto the body photo, polishes the result and runs an ESG analysis — all
 * server-side (see server/controllers/imageController.js). The original RN
 * screen scraped the Amazon page directly from the client; that only worked
 * because native fetch ignores CORS. On the web it has to go through the
 * server, so this screen just sends the link and waits for one response.
 */
export default function ImageTyrOn() {
  const { url, bodyImage, base64Image } = useContext(ImageFeatureContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/merge-clothing-esg", {
        bodyImageBase64: base64Image,
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
    if (url && (base64Image || bodyImage)) run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StepScreen headerTitle="Image Features" title="Virtual Try-On" backTo={-1}>
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
              <p className="text-sm text-slate-600">Brand: {result.productDetails.brand}</p>
              <p className="text-sm text-slate-600">Price: {result.productDetails.price}</p>
              {url && (
                <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
                  View original listing <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}

          {result.esgScores && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(result.esgScores).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card">
                  <div className="text-[11px] font-semibold uppercase text-slate-400">{k}</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{v ?? "--"}</div>
                </div>
              ))}
            </div>
          )}

          {result.priceComparison && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Price comparison</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["amazon", "flipkart", "myntra", "ajio"].map((store) => (
                  <div key={store} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card">
                    <div className="text-[11px] font-semibold capitalize text-slate-400">{store}</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">{result.priceComparison[store]}</div>
                  </div>
                ))}
              </div>
              {result.priceComparison.bestDealStore !== "Not available" && (
                <p className="mt-2 text-center text-xs font-semibold text-emerald-700">
                  Best deal: {result.priceComparison.bestDealStore} — {result.priceComparison.bestDeal}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </StepScreen>
  );
}
