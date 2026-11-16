import { useContext } from "react";
import { EVStationContext } from "../../context/EVStationContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

const FIELDS = [
  { key: "address", label: "Address" },
  { key: "chargers", label: "Charger types" },
  { key: "slots", label: "Slots available" },
  { key: "pricing", label: "Pricing" },
  { key: "availability", label: "Availability" },
  { key: "popularTimes", label: "Popular times" },
];

function buildPrompt({ stationLocation, selectedEV }) {
  return `suggest a list of 5 electric vehicle charging stations located in ${stationLocation}.
    Vehicle type is ${selectedEV}.
    For each charging station, provide the following information in a clear and concise format:
    don't start the result with ** and also include space when a new line comes.
      Station Name (mandatory)
      Address (mandatory)
      Charger Types Available (mandatory)
      Number of Slots Available (mandatory)
      Pricing Information (if available)
      Availability Status (e.g., Available, Busy, Offline)
      Popular Times (when the station is typically less busy)
      Coordinates (Latitude and Longitude in the format: Latitude, Longitude)
    the result should be like:
      Station name: ABC Charging Station
      Address: 123 Main Street, City, State
      Charger types: CCS, CHAdeMO, Type 2
      Number of slots available: 4
      Pricing: $0.25 per kWh
      Availability: Available
      Popular times: 10 PM to 6 AM
      Coordinates: [xx.xxxx, xx.xxxx]
    Ensure you start with station details, dont send any text other than station details.
    Please ensure that you always send valid coordinates for all the results that you give.`;
}

export default function RecommendEVStations() {
  const ctx = useContext(EVStationContext);
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/ev-stations", prompt, FIELDS);

  return (
    <StepScreen headerTitle="EV Stations" title={`Charging stations in ${ctx.stationLocation}`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} ${ctx.stationLocation}`}
        emptyLabel="No charging stations found nearby."
      />
    </StepScreen>
  );
}
