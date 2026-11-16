import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { api } from "../../api/client.js";

/**
 * Text input with city/place suggestions. Calls our backend's
 * /places-autocomplete proxy (see server/controllers/placesController.js)
 * instead of hitting Google's Places endpoint directly from the browser,
 * which avoids exposing an API key client-side and sidesteps CORS
 * restrictions that block that endpoint from browser JS.
 */
export default function LocationAutocomplete({ value, onChange, placeholder = "Enter a location" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleInput = (text) => {
    onChange(text);
    clearTimeout(debounceRef.current);
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get("/places-autocomplete", { params: { input: text } });
        setSuggestions(data.predictions || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
        <MapPin size={16} className="text-emerald-600" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-emerald-100">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-emerald-50"
              onMouseDown={() => {
                onChange(s.description);
                setOpen(false);
              }}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
