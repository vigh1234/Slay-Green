import { useState } from "react";
import Loader from "../../components/ui/Loader.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import RecommendationCard from "../../components/ui/RecommendationCard.jsx";
import ResultsMap from "../../components/ui/ResultsMap.jsx";

/**
 * Renders the loading / error / empty / results states shared by every
 * "Recommend*" screen: eco-hotels, vehicles, electronics, EV stations and
 * battery-swapping centers all funnel through this same UI.
 */
export default function RecommendationResults({
  items,
  loading,
  error,
  onRetry,
  searchQuery, // (item) => string, opens a Google search for that item
  emptyLabel = "No recommendations yet.",
}) {
  const [focus, setFocus] = useState(null);
  const hasMap = items.some((i) => i.coordinates);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items.length) return <p className="py-16 text-center text-sm text-slate-400">{emptyLabel}</p>;

  return (
    <div className="space-y-5">
      {hasMap && <ResultsMap items={items} focus={focus} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <RecommendationCard
            key={i}
            item={item}
            onLocate={(it) => setFocus(it.coordinates)}
            onOpen={
              searchQuery
                ? (it) => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery(it))}`, "_blank")
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
