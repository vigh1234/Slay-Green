import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { SurveyContext } from "../../context/SurveyContext.jsx";
import { api } from "../../api/client.js";
import StepScreen from "../../components/layout/StepScreen.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import { surveySteps } from "./surveySteps.js";

const lastStep = surveySteps[surveySteps.length - 1];

export default function SurveySubmitStep() {
  const navigate = useNavigate();
  const survey = useContext(SurveyContext);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const setterFor = (key) => survey[`set${key[0].toUpperCase()}${key.slice(1)}`];

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/save-survey-data", survey);
      setDone(true);
      setTimeout(() => navigate("/scan-image"), 1200);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not save your survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepScreen headerTitle="User Survey" title={lastStep.title} backTo={-1}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {lastStep.fields.map((f) => (
          <TextField
            key={f.key}
            label={f.label}
            value={survey[f.key] || ""}
            onChange={(e) => setterFor(f.key)(e.target.value)}
            inputMode="numeric"
            placeholder="Enter amount"
          />
        ))}
      </div>
      {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}
      <div className="mt-10 flex justify-center">
        <Button onClick={handleSubmit} disabled={submitting || done} className="w-full max-w-xs">
          {done ? (
            <>
              <CheckCircle2 size={16} /> Saved!
            </>
          ) : submitting ? (
            "Saving..."
          ) : (
            "Finish survey"
          )}
        </Button>
      </div>
    </StepScreen>
  );
}
