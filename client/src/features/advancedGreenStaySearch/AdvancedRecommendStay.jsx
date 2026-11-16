import { useContext } from "react";
import { AdvancedGreenStayContext } from "../../context/AdvancedGreenStayContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

function buildPrompt({ destination2, selectedPreferences, lowerBudgetValue, upperBudgetValue, currencyValue, startDateValue, endDateValue, travelParty }) {
  const firstPreference = selectedPreferences.length > 0 ? selectedPreferences[0] : "";
  const isCloseToMall = firstPreference.toLowerCase().includes("close") && firstPreference.toLowerCase().includes("mall");

  return `Suggest a list of 10 eco-friendly hotels or resorts located in ${destination2} which is ${selectedPreferences}.
    Budget value ranges from ${lowerBudgetValue} to ${upperBudgetValue} with selected currency as ${currencyValue}.
    Starting from ${startDateValue} to ${endDateValue} as ${travelParty} is the travel party.
    For each hotel or resort, provide the following information in a clear and concise format:
    don't start the result with ** and also include space when a new line comes.
      Hotel Name (mandatory)
      Estimated Price per Night (mandatory)
      Environmental Score (out of 10) (mandatory)
      Societal Score (out of 10) (mandatory)
      Governance Score (out of 10) (mandatory)
      Carbon Offset Score (in CO2e)
      ${isCloseToMall ? "Close to Mall (Closest mall with distance)" : `${firstPreference} Score (out of 10)`}
      Coordinates (Latitude and Longitude in the format: Latitude, Longitude)
    the result should be exactly like:
      Hotel name : ABC
      Estimated price per night : xxx
      Environmental score : xx
      Societal score : xx
      Governance score : xx
      Carbon offset score : xx CO2e
      ${isCloseToMall ? "Close to Mall : Closest mall with distance" : `${firstPreference} : xx`}
      Coordinates : [xx.xxxx, xx.xxxx]
    Ensure you start with hotel details, dont send any text other than hotel details.
    Please ensure that you always send valid coordinates for all the result that you give.`;
}

export default function AdvancedRecommendStay() {
  const ctx = useContext(AdvancedGreenStayContext);
  const firstPreference = ctx.selectedPreferences[0] || "Preference";
  const FIELDS = [
    { key: "price", label: "Price / night" },
    { key: "environmental", label: "Environmental" },
    { key: "societal", label: "Societal" },
    { key: "governance", label: "Governance" },
    { key: "carbon", label: "Carbon offset" },
    { key: "preference", label: firstPreference },
  ];
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/advanced-eco-hotels", prompt, FIELDS);

  return (
    <StepScreen headerTitle="Advanced Green Stay Search" title={`Stays in ${ctx.destination2}`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} hotel ${ctx.destination2}`}
      />
    </StepScreen>
  );
}
