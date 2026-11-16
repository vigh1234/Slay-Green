import { useState } from "react";
import { Search as SearchIcon, PlayCircle } from "lucide-react";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { api } from "../../api/client.js";

export default function VideoSearch() {
  const [userInput, setUserInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    if (!userInput) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const prompt = `Generate a list of 6 titles and a short description for each title of: ${userInput}`;
      const data = await api.post("/generate-video", { prompt });
      const lines = (data.response || "").split("\n").filter((l) => l.trim() !== "");
      const parsed = [];
      for (let i = 0; i < lines.length; i += 2) {
        const title = lines[i]?.replace("Title: ", "").trim();
        const description = lines[i + 1]?.replace("Description: ", "").trim();
        if (title && description) parsed.push({ title, description });
      }
      setSuggestions(parsed);
      if (parsed.length === 0) setError("Couldn't generate suggestions — try rephrasing your topic.");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong generating suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepScreen headerTitle="Video Search" title="What are you in the mood to watch?" backTo="/">
      <div className="flex gap-2">
        <div className="flex-1">
          <TextField
            placeholder="e.g. sustainable fashion tips"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchSuggestions()}
          />
        </div>
        <Button onClick={fetchSuggestions} disabled={loading}>
          <SearchIcon size={16} /> Search
        </Button>
      </div>

      {loading && <Loader label="Generating video ideas..." />}
      {error && <ErrorState message={error} onRetry={fetchSuggestions} />}

      {!loading && suggestions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-slate-900">
                <PlayCircle size={18} />
                <h3 className="text-sm font-bold">{s.title}</h3>
              </div>
              <p className="text-sm text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      )}
    </StepScreen>
  );
}
