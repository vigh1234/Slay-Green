import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ImageFeatureContext } from "../../context/ImageFeatureContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import CategoryGrid from "../shared/CategoryGrid.jsx";

export default function ImageCategory() {
  const navigate = useNavigate();
  const { setCategory } = useContext(ImageFeatureContext);

  return (
    <StepScreen headerTitle="Image Features" backTo={-1}>
      <CategoryGrid
        title="What category is this item?"
        buttonLabel="Analyze"
        onNext={(cat) => {
          setCategory(cat);
          navigate("/image-features/analysis");
        }}
      />
    </StepScreen>
  );
}
