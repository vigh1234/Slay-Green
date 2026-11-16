import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SurveyContext } from "../../context/SurveyContext.jsx";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";
import { surveySteps } from "./surveySteps.js";

export default function SurveyStepPage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const survey = useContext(SurveyContext);
  const config = surveySteps.find((s) => s.path === step);

  if (!config) return null;

  const setterFor = (key) => survey[`set${key[0].toUpperCase()}${key.slice(1)}`];

  const handleNext = () => {
    if (config.next) navigate(`/survey/${config.next}`);
    else navigate("/survey/submit");
  };

  return (
    <StepScreen headerTitle="User Survey" title={config.title} backTo={-1}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {config.fields.map((f) =>
          f.type === "select" ? (
            <Select
              key={f.key}
              label={f.label}
              required={f.required}
              value={survey[f.key] || ""}
              onChange={(e) => setterFor(f.key)(e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          ) : (
            <TextField
              key={f.key}
              label={f.label}
              required={f.required}
              value={survey[f.key] || ""}
              onChange={(e) => setterFor(f.key)(e.target.value)}
              inputMode="numeric"
              placeholder="Enter amount"
            />
          )
        )}
      </div>
      <NextButton onClick={handleNext} />
    </StepScreen>
  );
}
