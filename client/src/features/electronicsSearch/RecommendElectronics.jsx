import { useContext } from "react";
import { ElectronicsSearchContext } from "../../context/ElectronicsSearchContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import RecommendationResults from "../shared/RecommendationResults.jsx";
import { useAiRecommendations } from "../../hooks/useAiRecommendations.js";

const FIELDS = [
  { key: "environmental", label: "Environmental" },
  { key: "social", label: "Social" },
  { key: "governance", label: "Governance" },
  { key: "emission", label: "Emission" },
  { key: "carbon", label: "Carbon offset" },
  { key: "price", label: "Price estimate" },
  { key: "store", label: "Authorized store" },
  { key: "website", label: "Store website" },
];

function buildPrompt({ electronicType, homeAddress }) {
  return `Generate a list of 6 ${electronicType} available near ${homeAddress}.
    For each product, provide the following information in a clear and concise format:
    don't start the result with ** and also include space when a new line comes.
     Product Name (mandatory)
     Environmental Score (out of 10) (mandatory)
     Social Score (out of 10) (mandatory)
     Governance Score (out of 10) (mandatory)
     Emission Score (out of 10) (mandatory)
     Carbon Offset Score(in CO2e) (mandatory)
     Price Estimate (mandatory)
     Authorized Store Name and Place (mandatory)
     Store Website (mandatory) (if they have one)
     the result should be like :
      ABC (Product name)
      xx (Environmental score)
      xx (Social score)
      xx (Governance score)
      xx (emission score)
      xx CO2e (Carbon offset score)
      xxx (Price Estimate)
      xxx (Authorized Store)
      abc.com (Store Website)
    Ensure you start with product details, dont send any text other than product details.
    Please ensure that you always send Authorized store for all the result that you give.
    Please do not include any additional details beyond what I have specified.`;
}

export default function RecommendElectronics() {
  const ctx = useContext(ElectronicsSearchContext);
  const prompt = buildPrompt(ctx);
  const { items, loading, error, refetch } = useAiRecommendations("/recommend-electronics", prompt, FIELDS);

  return (
    <StepScreen headerTitle="Consumer Electronics" title={`${ctx.electronicType || "Electronics"} near you`} backTo={-1}>
      <RecommendationResults
        items={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={(item) => `${item.name} ${ctx.electronicType}`}
        emptyLabel="No products found — try a different category."
      />
    </StepScreen>
  );
}
