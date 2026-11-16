import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import { EVStationContext } from "../../context/EVStationContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import OptionCard from "../../components/ui/OptionCard.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import { api } from "../../api/client.js";

// This step's option list is itself AI-generated (popular EV models for the
// chosen location), unlike the static option grids used elsewhere.
export default function EVOptions() {
  const navigate = useNavigate();
  const { stationLocation, setSelectedEV } = useContext(EVStationContext);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    const vehiclePrompt = `Provide a list of exactly 6 electric vehicle model names that are popular and suitable for users in ${stationLocation}.
    The EV's can be any type like EV cars, bikes, EV heavy vehicles even EV 3-wheeler'.
    For each electric vehicle, provide only the model name in this format :
    Model: Tesla Model 3
    Model: Nissan Leaf
    Ensure you provide exactly 6 model names, nothing more. Don't include any additional text, explanations, or other details.`;
    try {
      const data = await api.post("/ev-options", { vehiclePrompt });
      const parsed = (data.text || "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("Model:"))
        .map((l) => l.replace("Model:", "").trim());
      setModels(parsed);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not load EV models.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (!selected) return alert("Select a vehicle to continue!");
    setSelectedEV(selected);
    navigate("/ev-stations/recommendations");
  };

  return (
    <StepScreen headerTitle="EV Stations" title="Choose your EV model" backTo={-1}>
      {loading && <Loader label="Finding popular EVs near you..." />}
      {error && <ErrorState message={error} onRetry={fetchModels} />}
      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-3">
            {models.map((m) => (
              <OptionCard key={m} icon={Car} label={m} selected={selected === m} onClick={() => setSelected(selected === m ? null : m)} />
            ))}
          </div>
          <NextButton onClick={handleNext} />
        </>
      )}
    </StepScreen>
  );
}
