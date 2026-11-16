import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";
import { parseAiList } from "../lib/parseAiList.js";

/**
 * Fires a prompt at one of the backend's Gemini-powered "recommend" endpoints
 * and parses the free-text response into structured items.
 *
 * @param {string} endpoint - e.g. "/eco-hotels"
 * @param {string} prompt - fully built prompt string
 * @param {Array<{key:string,label:string}>} fieldDefs - expected fields, in order, after the name
 * @param {{responseKey?: string, auto?: boolean}} [options]
 */
export function useAiRecommendations(endpoint, prompt, fieldDefs, options = {}) {
  const { responseKey = "text", auto = true } = options;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post(endpoint, { prompt });
      const text = data?.[responseKey] ?? data?.text ?? data?.response ?? "";
      setItems(parseAiList(text, fieldDefs));
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [endpoint, prompt]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (auto && prompt) run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, loading, error, refetch: run };
}

export default useAiRecommendations;
