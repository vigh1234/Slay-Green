import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BatterySwappingContext } from "../../context/BatterySwappingContext.jsx";
import { AdminContext } from "../../context/AdminContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { api } from "../../api/client.js";

// Locations offered per provider — mirrors the RN app's static map.
const locationMap = {
  "yuma energy": ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Indore", "Kochi"],
  "honda eswap": ["Bengaluru", "Mumbai", "Delhi"],
  "bpcl e-drive": ["Kochi", "Lucknow"],
};

export default function CompanyAndLocations() {
  const navigate = useNavigate();
  const { setCompanyLocations } = useContext(BatterySwappingContext);
  const { setSelectedServiceProviders } = useContext(AdminContext);
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/selected-service-providers");
        const providers = data.providers || [];
        setSelectedServiceProviders(providers);
        setCompanyList(providers);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        // Fall back to the full known provider list so the flow still works
        // even if no admin has curated a list yet.
        setCompanyList(["Yuma Energy", "Honda Eswap", "BPCL e-Drive"]);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const locationOptions = company ? locationMap[company.toLowerCase()] || [] : [];

  const handleNext = () => {
    if (!company || !location) {
      setError("Please select both company and location.");
      return;
    }
    setCompanyLocations({ company, location });
    navigate("/battery-swapping/recommendations");
  };

  return (
    <StepScreen headerTitle="Battery Swapping Centers" title="Choose a provider" backTo={-1}>
      {loading ? (
        <Loader label="Loading service providers..." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Select
            label="Company"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              setLocation("");
            }}
          >
            <option value="">Select a company</option>
            {companyList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="Location" value={location} disabled={!company} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locationOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
          {error && <p className="text-center text-sm font-semibold text-red-500">{error}</p>}
          <NextButton onClick={handleNext} />
        </div>
      )}
    </StepScreen>
  );
}
