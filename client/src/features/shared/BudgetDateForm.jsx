import { useState } from "react";
import TextField from "../../components/ui/TextField.jsx";
import Select from "../../components/ui/Select.jsx";
import NextButton from "../../components/ui/NextButton.jsx";

const toInputDate = (d) => d.toISOString().slice(0, 10);

/** Shared budget range + travel dates step for stay-search flows. */
export default function BudgetDateForm({ initial, onNext }) {
  const [lowerBudget, setLowerBudget] = useState(initial?.lowerBudgetValue || "2000");
  const [upperBudget, setUpperBudget] = useState(initial?.upperBudgetValue || "5000");
  const [currency, setCurrency] = useState(initial?.currencyValue || "₹");
  const [startDate, setStartDate] = useState(toInputDate(initial?.startDateValue || new Date()));
  const [endDate, setEndDate] = useState(
    toInputDate(initial?.endDateValue || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))
  );
  const [error, setError] = useState("");

  const handleNext = () => {
    const budgetRegex = /^\d+$/;
    if (!budgetRegex.test(lowerBudget) || !budgetRegex.test(upperBudget)) {
      setError("Please enter a valid budget range");
      return;
    }
    if (parseInt(lowerBudget) > parseInt(upperBudget)) {
      setError("Lower budget cannot be greater than upper budget");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date");
      return;
    }
    setError("");
    onNext({
      lowerBudgetValue: lowerBudget,
      upperBudgetValue: upperBudget,
      currencyValue: currency,
      startDateValue: new Date(startDate),
      endDateValue: new Date(endDate),
    });
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-lg font-extrabold text-slate-900">Budget &amp; Travel Dates</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Minimum budget" inputMode="numeric" value={lowerBudget} onChange={(e) => setLowerBudget(e.target.value)} />
        <TextField label="Maximum budget" inputMode="numeric" value={upperBudget} onChange={(e) => setUpperBudget(e.target.value)} />
        <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="$">$ USD</option>
          <option value="₹">₹ INR</option>
        </Select>
        <div />
        <TextField label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <TextField label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}
      <NextButton onClick={handleNext} />
    </div>
  );
}
