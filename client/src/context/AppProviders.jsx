import { GreenStaySearchProvider } from "./GreenStaySearchContext.jsx";
import { GreenVehicleSearchProvider } from "./GreenVehicleSearchContext.jsx";
import { AdvancedGreenStayProvider } from "./AdvancedGreenStayContext.jsx";
import { AdvancedGreenVehicleProvider } from "./AdvancedGreenVehicleContext.jsx";
import { ElectronicsSearchProvider } from "./ElectronicsSearchContext.jsx";
import { EVStationProvider } from "./EVStationContext.jsx";
import { BatterySwappingProvider } from "./BatterySwappingContext.jsx";
import { ImageDetectionProvider } from "./ImageDetectionContext.jsx";
import { ImageFeatureProvider } from "./ImageFeatureContext.jsx";
import { ImageMergeProvider } from "./ImageMergeContext.jsx";
import { ProductProvider } from "./ProductContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";
import { SurveyProvider } from "./SurveyContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";

const providers = [
  AuthProvider,
  SurveyProvider,
  GreenStaySearchProvider,
  GreenVehicleSearchProvider,
  AdvancedGreenStayProvider,
  AdvancedGreenVehicleProvider,
  ElectronicsSearchProvider,
  EVStationProvider,
  BatterySwappingProvider,
  ImageDetectionProvider,
  ImageFeatureProvider,
  ImageMergeProvider,
  ProductProvider,
  AdminProvider,
];

/** Composes every feature's context provider into a single wrapper. */
export function AppProviders({ children }) {
  return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
}

export default AppProviders;
