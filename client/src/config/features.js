import {
  Home, Car, Hotel, Zap, Cpu, Fuel, ShoppingCart, Search as SearchIcon,
  BatteryCharging, Shirt, MapPinned, Camera, CreditCard, Sparkles, ClipboardCheck,
} from "lucide-react";

export const FEATURE_GROUPS = [
  { name: "Travel & Mobility", blurb: "Stays, rides and charging for greener journeys." },
  { name: "Lifestyle", blurb: "Smarter shopping, electronics and fashion." },
  { name: "AI Tools", blurb: "Scan, search and analyse with AI." },
  { name: "Account", blurb: "Payments and your Slay Green account." },
];

// Single source of truth for the signed-in experience: used by the sidebar
// and by the home dashboard. (The admin panel is intentionally not listed —
// it is reachable only by its direct URL.)
export const FEATURE_ITEMS = [
  { to: "/green-stay", label: "Green Stay Search", icon: Home, group: "Travel & Mobility", desc: "Find eco-friendly hotels, homestays and lodges for your trip." },
  { to: "/green-vehicle", label: "Green Vehicle Search", icon: Car, group: "Travel & Mobility", desc: "Discover electric and hybrid vehicles around your destination." },
  { to: "/advanced-stay", label: "Advanced Stay Search", icon: Hotel, group: "Travel & Mobility", desc: "Fine-tune stay recommendations to your own preferences." },
  { to: "/advanced-vehicle", label: "Advanced Vehicle Search", icon: Zap, group: "Travel & Mobility", desc: "A guided, detailed search for the right green vehicle." },
  { to: "/ev-stations", label: "EV Stations", icon: MapPinned, group: "Travel & Mobility", desc: "Locate charging stations that suit your EV model." },
  { to: "/ev-services", label: "EV Services Booking", icon: Fuel, group: "Travel & Mobility", desc: "Book servicing and maintenance for your electric vehicle." },
  { to: "/battery-swapping", label: "Battery Swapping", icon: BatteryCharging, group: "Travel & Mobility", desc: "Find battery-swapping centres for your type of vehicle." },
  { to: "/electronics", label: "Consumer Electronics", icon: Cpu, group: "Lifestyle", desc: "Discover sustainable electronics available near you." },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingCart, group: "Lifestyle", desc: "List and shop products, each with an ESG analysis." },
  { to: "/cloth-try-on", label: "Cloth Try-On", icon: Shirt, group: "Lifestyle", desc: "Preview clothing on yourself with a virtual try-on." },
  { to: "/scan-image", label: "Scan Image", icon: Camera, group: "AI Tools", desc: "Upload a product photo to see its sustainability details." },
  { to: "/video-search", label: "Video Search", icon: SearchIcon, group: "AI Tools", desc: "Get video ideas on any topic you feel like watching." },
  { to: "/image-features", label: "Image Features", icon: Sparkles, group: "AI Tools", desc: "Virtual try-on and item analysis from your own images." },
  { to: "/payment", label: "Payment", icon: CreditCard, group: "Account", desc: "Pay securely with Google Pay or card." },
];

export const SURVEY_ITEM = {
  to: "/survey", label: "Take the Survey", icon: ClipboardCheck,
  desc: "Tell us about yourself so we can tailor what we recommend.",
};
