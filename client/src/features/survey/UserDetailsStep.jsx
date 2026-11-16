import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { SurveyContext } from "../../context/SurveyContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const countries = Country.getAllCountries();

export default function UserDetailsStep() {
  const navigate = useNavigate();
  const {
    emailId, setEmailId,
    zipcodeValue, setZipcodeValue,
    countryName, setCountryName,
    stateName, setStateName,
    cityName, setCityName,
    temperatureValue, setTemperatureValue,
    selectedPeopleValue, setSelectedPeopleValue,
  } = useContext(SurveyContext);

  const [error, setError] = useState("");
  const states = useMemo(
    () => (countryName ? State.getStatesOfCountry(countryName.isoCode) : []),
    [countryName]
  );

  const handleNext = () => {
    if (!emailId || !zipcodeValue || !countryName || !stateName || !cityName || !temperatureValue || !selectedPeopleValue) {
      setError("All fields are required");
      setTimeout(() => setError(""), 6000);
      return;
    }
    navigate("/survey/household-info");
  };

  return (
    <StepScreen headerTitle="User Survey" title="Tell us about yourself" backTo="/">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Email" required type="email" value={emailId}
          onChange={(e) => setEmailId(e.target.value)} placeholder="you@example.com"
        />
        <TextField
          label="Zipcode / Pincode" required inputMode="numeric" value={zipcodeValue}
          onChange={(e) => setZipcodeValue(e.target.value)} placeholder="Zipcode / Pincode"
        />
        <Select
          label="Country" required
          value={countryName?.isoCode || ""}
          onChange={(e) => {
            const c = countries.find((c) => c.isoCode === e.target.value) || null;
            setCountryName(c);
            setStateName(null);
          }}
        >
          <option value="" disabled>Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
          ))}
        </Select>
        <Select
          label="State" required disabled={!countryName}
          value={stateName?.isoCode || ""}
          onChange={(e) => setStateName(states.find((s) => s.isoCode === e.target.value) || null)}
        >
          <option value="" disabled>Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
          ))}
        </Select>
        <TextField
          label="City" required value={cityName}
          onChange={(e) => setCityName(e.target.value)} placeholder="City"
        />
        <TextField
          label="Temperature outside today (°C)" required inputMode="numeric" value={temperatureValue}
          onChange={(e) => setTemperatureValue(e.target.value)} placeholder="e.g. 28"
        />
        <Select
          label="People living in your household" required
          value={selectedPeopleValue}
          onChange={(e) => setSelectedPeopleValue(e.target.value)}
        >
          <option value="" disabled>Select</option>
          {["1", "2", "3", "4", "5+"].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </Select>
      </div>
      {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
