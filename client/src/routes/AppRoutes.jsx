import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import NotFound from "./NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Loader from "../components/ui/Loader.jsx";

// Every feature screen is lazy-loaded so the initial bundle stays small —
// this app has 16 feature modules and ~65 screens in total.
const HomePage = lazy(() => import("../features/home/HomePage.jsx"));
const AuthPage = lazy(() => import("../features/auth/AuthPage.jsx"));

const UserDetailsStep = lazy(() => import("../features/survey/UserDetailsStep.jsx"));
const SurveyStepPage = lazy(() => import("../features/survey/SurveyStepPage.jsx"));
const SurveySubmitStep = lazy(() => import("../features/survey/SurveySubmitStep.jsx"));

const ImageDetection = lazy(() => import("../features/imageDetection/ImageDetection.jsx"));
const ProductCategoryScan = lazy(() => import("../features/imageDetection/ProductCategory.jsx"));
const ImageDetails = lazy(() => import("../features/imageDetection/ImageDetails.jsx"));

const Destination = lazy(() => import("../features/greenStaySearch/Destination.jsx"));
const BudgetAndDate = lazy(() => import("../features/greenStaySearch/BudgetAndDate.jsx"));
const TravelParty = lazy(() => import("../features/greenStaySearch/TravelParty.jsx"));
const RecommendStay = lazy(() => import("../features/greenStaySearch/RecommendStay.jsx"));

const VehicleDestination = lazy(() => import("../features/greenVehicleSearch/VehicleDestination.jsx"));
const VehicleType = lazy(() => import("../features/greenVehicleSearch/VehicleType.jsx"));
const VehicleOption = lazy(() => import("../features/greenVehicleSearch/VehicleOption.jsx"));
const RecommendAuto = lazy(() => import("../features/greenVehicleSearch/RecommendAuto.jsx"));

const AssistMeStay = lazy(() => import("../features/advancedGreenStaySearch/AssistMeStay.jsx"));
const AdvancedBudgetAndDate = lazy(() => import("../features/advancedGreenStaySearch/AdvancedBudgetAndDate.jsx"));
const AdvancedTravelParty = lazy(() => import("../features/advancedGreenStaySearch/AdvancedTravelParty.jsx"));
const AdvancedRecommendStay = lazy(() => import("../features/advancedGreenStaySearch/AdvancedRecommendStay.jsx"));

const AssistMeAuto = lazy(() => import("../features/advancedGreenVehicleSearch/AssistMeAuto.jsx"));
const AdvancedVehicleType = lazy(() => import("../features/advancedGreenVehicleSearch/AdvancedVehicleType.jsx"));
const AdvancedVehicleOption = lazy(() => import("../features/advancedGreenVehicleSearch/AdvancedVehicleOption.jsx"));
const AdvancedRecommendAuto = lazy(() => import("../features/advancedGreenVehicleSearch/AdvancedRecommendAuto.jsx"));

const HomeAddress = lazy(() => import("../features/electronicsSearch/HomeAddress.jsx"));
const ElectronicType = lazy(() => import("../features/electronicsSearch/ElectronicType.jsx"));
const RecommendElectronics = lazy(() => import("../features/electronicsSearch/RecommendElectronics.jsx"));

const EVServices = lazy(() => import("../features/evServiceBooking/EVServices.jsx"));
const ServiceProviders = lazy(() => import("../features/evServiceBooking/ServiceProviders.jsx"));
const AppointmentScheduler = lazy(() => import("../features/evServiceBooking/AppointmentScheduler.jsx"));
const AppointmentPayment = lazy(() => import("../features/evServiceBooking/AppointmentPayment.jsx"));
const PaymentConfirmation = lazy(() => import("../features/evServiceBooking/PaymentConfirmation.jsx"));

const UploadProductImage = lazy(() => import("../features/marketPlace/UploadProductImage.jsx"));
const ProductDetails = lazy(() => import("../features/marketPlace/ProductDetails.jsx"));
const ProductList = lazy(() => import("../features/marketPlace/ProductList.jsx"));
const ProductView = lazy(() => import("../features/marketPlace/ProductView.jsx"));
const Cart = lazy(() => import("../features/marketPlace/Cart.jsx"));
const Checkout = lazy(() => import("../features/marketPlace/Checkout.jsx"));

const VideoSearch = lazy(() => import("../features/videoSearch/Search.jsx"));

const BSLocation = lazy(() => import("../features/batterySwapping/Location.jsx"));
const BSVehicleTypes = lazy(() => import("../features/batterySwapping/VehicleTypes.jsx"));
const BSCompanyAndLocations = lazy(() => import("../features/batterySwapping/CompanyAndLocations.jsx"));
const BatterySwappingRecommendations = lazy(() => import("../features/batterySwapping/BatterySwappingRecommendations.jsx"));

const ImageExtraction = lazy(() => import("../features/clothTryOn/ImageExtraction.jsx"));
const TryOnImage = lazy(() => import("../features/clothTryOn/TryOnImage.jsx"));

const EVLocation = lazy(() => import("../features/evStations/EVLocation.jsx"));
const EVOptions = lazy(() => import("../features/evStations/EVOptions.jsx"));
const RecommendEVStations = lazy(() => import("../features/evStations/RecommendEVStations.jsx"));

const UploadImage = lazy(() => import("../features/imageFeature/UploadImage.jsx"));
const ImageCategory = lazy(() => import("../features/imageFeature/ImageCategory.jsx"));
const ImageAnalysis = lazy(() => import("../features/imageFeature/ImageAnalysis.jsx"));
const ImageTyrOn = lazy(() => import("../features/imageFeature/ImageTyrOn.jsx"));

const GooglePayPayment = lazy(() => import("../features/googlePay/Payment.jsx"));

const AdminLogin = lazy(() => import("../features/admin/AdminLogin.jsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.jsx"));
const PrivacyPage = lazy(() => import("../pages/LegalPages.jsx").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("../pages/LegalPages.jsx").then((m) => ({ default: m.TermsPage })));
const BatterySwappingAdminPage = lazy(() => import("../features/admin/BatterySwappingAdminPage.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="py-24"><Loader /></div>}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Admin has its own server-side password and is intentionally not linked from the UI */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/battery-swapping" element={<BatterySwappingAdminPage />} />

          {/* Everything below needs a signed-in user */}
          <Route element={<ProtectedRoute />}>

          {/* User Survey */}
          <Route path="/survey" element={<Navigate to="/survey/details" replace />} />
          <Route path="/survey/details" element={<UserDetailsStep />} />
          <Route path="/survey/submit" element={<SurveySubmitStep />} />
          <Route path="/survey/:step" element={<SurveyStepPage />} />

          {/* Scan Image */}
          <Route path="/scan-image" element={<ImageDetection />} />
          <Route path="/scan-image/category" element={<ProductCategoryScan />} />
          <Route path="/scan-image/details" element={<ImageDetails />} />

          {/* Green Stay Search */}
          <Route path="/green-stay" element={<Destination />} />
          <Route path="/green-stay/budget" element={<BudgetAndDate />} />
          <Route path="/green-stay/travel-party" element={<TravelParty />} />
          <Route path="/green-stay/recommendations" element={<RecommendStay />} />

          {/* Green Vehicle Search */}
          <Route path="/green-vehicle" element={<VehicleDestination />} />
          <Route path="/green-vehicle/type" element={<VehicleType />} />
          <Route path="/green-vehicle/option" element={<VehicleOption />} />
          <Route path="/green-vehicle/recommendations" element={<RecommendAuto />} />

          {/* Advanced Green Stay Search */}
          <Route path="/advanced-stay" element={<AssistMeStay />} />
          <Route path="/advanced-stay/budget" element={<AdvancedBudgetAndDate />} />
          <Route path="/advanced-stay/travel-party" element={<AdvancedTravelParty />} />
          <Route path="/advanced-stay/recommendations" element={<AdvancedRecommendStay />} />

          {/* Advanced Green Vehicle Search */}
          <Route path="/advanced-vehicle" element={<AssistMeAuto />} />
          <Route path="/advanced-vehicle/type" element={<AdvancedVehicleType />} />
          <Route path="/advanced-vehicle/option" element={<AdvancedVehicleOption />} />
          <Route path="/advanced-vehicle/recommendations" element={<AdvancedRecommendAuto />} />

          {/* Consumer Electronics */}
          <Route path="/electronics" element={<HomeAddress />} />
          <Route path="/electronics/type" element={<ElectronicType />} />
          <Route path="/electronics/recommendations" element={<RecommendElectronics />} />

          {/* EV Services Booking */}
          <Route path="/ev-services" element={<EVServices />} />
          <Route path="/ev-services/providers" element={<ServiceProviders />} />
          <Route path="/ev-services/schedule" element={<AppointmentScheduler />} />
          <Route path="/ev-services/payment" element={<AppointmentPayment />} />
          <Route path="/ev-services/confirmation" element={<PaymentConfirmation />} />

          {/* Market Place */}
          <Route path="/marketplace" element={<UploadProductImage />} />
          <Route path="/marketplace/details" element={<ProductDetails />} />
          <Route path="/marketplace/products" element={<ProductList />} />
          <Route path="/marketplace/product/:productId" element={<ProductView />} />
          <Route path="/marketplace/cart" element={<Cart />} />
          <Route path="/marketplace/checkout" element={<Checkout />} />

          {/* Video Search */}
          <Route path="/video-search" element={<VideoSearch />} />

          {/* Battery Swapping Centers */}
          <Route path="/battery-swapping" element={<BSLocation />} />
          <Route path="/battery-swapping/vehicle-type" element={<BSVehicleTypes />} />
          <Route path="/battery-swapping/company" element={<BSCompanyAndLocations />} />
          <Route path="/battery-swapping/recommendations" element={<BatterySwappingRecommendations />} />

          {/* Cloth Try-On */}
          <Route path="/cloth-try-on" element={<ImageExtraction />} />
          <Route path="/cloth-try-on/result" element={<TryOnImage />} />

          {/* EV Stations */}
          <Route path="/ev-stations" element={<EVLocation />} />
          <Route path="/ev-stations/options" element={<EVOptions />} />
          <Route path="/ev-stations/recommendations" element={<RecommendEVStations />} />

          {/* Image Features (virtual try-on / ESG analysis) */}
          <Route path="/image-features" element={<UploadImage />} />
          <Route path="/image-features/category" element={<ImageCategory />} />
          <Route path="/image-features/analysis" element={<ImageAnalysis />} />
          <Route path="/image-features/try-on" element={<ImageTyrOn />} />

          {/* Payment */}
          <Route path="/payment" element={<GooglePayPayment />} />

          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
