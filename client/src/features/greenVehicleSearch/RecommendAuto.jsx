import { useContext } from "react";
import { GreenVehicleSearchContext } from "../../context/GreenVehicleSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

const FIELDS = [
  { key: "price", label: "Price estimate" },
  { key: "environmental", label: "Environmental" },
  { key: "societal", label: "Societal" },
  { key: "governance", label: "Governance" },
  { key: "emission", label: "Emission" },
  { key: "carbon", label: "Carbon offset" },
  { key: "dealership", label: "Dealership" },
  { key: "website", label: "Website" },
];

function buildPrompt({ destination1, selectedVehicle1, selectedVehicle }) {
  return `suggest a list of 10 ${selectedVehicle} types of ${selectedVehicle1} located at ${destination1}.
    For each vehicle, provide the following information in a clear and concise format:
    don't start the result with ** and also include space when a new line comes.
      Vehicle name (mandatory)
      Price estimates (mandatory)
      Environmental Score vehicle(out of 10) (mandatory)
      Social Score vehicle(out of 10) (mandatory)
      Governance Score vehicle(out of 10) (mandatory)
      Emission score of the vehicle(in g/kg CO2) (mandatory)
      Carbon Offset Score (in CO2e)
      An authorized dealership's name
      Website of the dealership (if they have one)
      Coordinates (Latitude and Longitude in the format: Latitude, Longitude)
    the result should be like:
       ABC (Vehicle name)
       xxx (Price estimates)
       xx (Environmental score)
       xx (Societal score)
       xx (Governance score)
       xx g/kg CO2 (Emission score)
       xx CO2e (Carbon offset score)
       xxx (Dealership name)
       abc.com (Dealership website)
       Coordinates : [xx.xxxx, xx.xxxx]
    Ensure you start with vehicle details, dont send any text other than vehicle details.
    Please ensure that you always send valid coordinates for all the result that you give.
    Please do not include any additional details beyond what I have specified.`;
}

export default function RecommendAuto() {
  const ctx = useContext(GreenVehicleSearchContext);
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/vehicle-types", prompt, FIELDS);

  return (
    <StepScreen headerTitle="Green Vehicle Search" title={`${ctx.selectedVehicle1 || "Vehicles"} near ${ctx.destination1}`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} dealership at ${ctx.destination1}`}
        emptyLabel="No vehicles found — try a different destination."
      />
    </StepScreen>
  );
}
