import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ImageDetectionContext } from "../../context/ImageDetectionContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import CategoryGrid from "../shared/CategoryGrid.jsx";

export default function ProductCategory() {
  const navigate = useNavigate();
  const { setCategory } = useContext(ImageDetectionContext);

  return (
    <StepScreen headerTitle="Scan Image" backTo={-1}>
      <CategoryGrid
        title="What category is this item?"
        buttonLabel="Analyze"
        onNext={(cat) => {
          setCategory(cat);
          navigate("/scan-image/details");
        }}
      />
    </StepScreen>
  );
}
