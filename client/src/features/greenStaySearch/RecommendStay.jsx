import { useContext } from "react";
import { GreenStaySearchContext } from "../../context/GreenStaySearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

const FIELDS = [
  { key: "price", label: "Price / night" },
  { key: "environmental", label: "Environmental" },
  { key: "societal", label: "Societal" },
  { key: "governance", label: "Governance" },
  { key: "carbon", label: "Carbon offset" },
];

function buildPrompt({ destination, lowerBudgetValue, upperBudgetValue, currencyValue, startDateValue, endDateValue, travelParty }) {
  return `suggest a list of 10 eco-friendly hotels or resorts located in ${destination}.
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
      Coordinates (Latitude and Longitude in the format: Latitude, Longitude)
    the result should be like:
      ABC (Hotel name)
      xxx (Estimated price per night)
      xx (Environmental score)
      xx (Societal score)
      xx (Governance score)
      xx CO2e (Carbon offset score)
      Coordinates : [xx.xxxx, xx.xxxx]
      * don't need to send that label of each score, just the score only needed
    Ensure you start with hotel details, dont send any text other than hotel details.
    Please ensure that you always send valid coordinates for all the result that you give.
    Please do not include any additional details beyond what I have specified.`;
}

export default function RecommendStay() {
  const ctx = useContext(GreenStaySearchContext);
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/eco-hotels", prompt, FIELDS);

  return (
    <StepScreen headerTitle="Green Stay Search" title={`Eco-friendly stays in ${ctx.destination}`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} hotel ${ctx.destination}`}
        emptyLabel="No stays found — try a different destination."
      />
    </StepScreen>
  );
}
