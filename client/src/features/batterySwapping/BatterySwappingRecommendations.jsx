import { useContext } from "react";
import { BatterySwappingContext } from "../../context/BatterySwappingContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

const FIELDS = [
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "compatibility", label: "Compatibility" },
  { key: "address", label: "Address" },
  { key: "distance", label: "Distance" },
  { key: "hours", label: "Hours" },
  { key: "swapTime", label: "Swap time" },
  { key: "contact", label: "Contact" },
  { key: "rating", label: "Rating" },
];

function buildPrompt({ vehicleType, location1, companyLocations }) {
  return `Generate a list of 5 battery swapping centers for ${vehicleType} within a 20-mile radius of ${location1}, operated by ${companyLocations.company} in ${companyLocations.location}.
    For each battery swapping center, provide the following information in a clear and concise format:
    Do not start the result with ** and ensure proper spacing on new lines.
      - Center Name
      - Company Name
      - Location (City)
      - Vehicle Compatibility (e.g., 2-wheeler, 3-wheeler, or both)
      - Full Address
      - Distance from user's location (in miles)
      - Operating Hours
      - Swap Time (in minutes)
      - Contact Information (e.g., phone number or email)
      - Rating (out of 5, based on user reviews)
      - Coordinates (Latitude and Longitude in the format: Latitude, Longitude)
    Ensure the coordinates are provided for the location.
    If coordinates are not available, generate reasonable coordinates based on the center's address or city.
    Do not include any additional information beyond what is specified.`;
}

export default function BatterySwappingRecommendations() {
  const ctx = useContext(BatterySwappingContext);
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/swapping-centers", prompt, FIELDS);

  return (
    <StepScreen headerTitle="Battery Swapping Centers" title={`${ctx.companyLocations.company} centers near ${ctx.location1}`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} ${ctx.companyLocations.location}`}
        emptyLabel="No swapping centers found nearby."
      />
    </StepScreen>
  );
}
