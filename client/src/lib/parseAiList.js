// The backend's Gemini-powered endpoints return a single block of text: one
// "item" per paragraph, one field per line, in a fixed order the prompt asks
// for. These helpers turn that loosely-structured text into an array of
// { name, fields: [...], coordinates } objects that the UI can render as cards
// and, where coordinates are present, plot on a map.

const COORD_RE = /(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/;

/** Split raw AI text into non-empty item blocks (one per recommendation). */
export function splitBlocks(text) {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) =>
      block
        .split("\n")
        .map((l) => l.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean)
    )
    .filter((lines) => lines.length > 0);
}

/** Find lat/lng coordinates anywhere inside a block of lines. */
export function extractCoordinates(lines) {
  for (const line of lines) {
    const match = line.match(COORD_RE);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return [lat, lng];
      }
    }
  }
  return null;
}

/**
 * Parse AI text into structured items.
 * `fieldDefs` is an array of { key, label } describing each expected line,
 * in order, *after* the name (lines[0]). Lines that look like coordinates
 * are skipped when matching against fieldDefs, since their position can
 * shift slightly between responses.
 */
export function parseAiList(text, fieldDefs = []) {
  const blocks = splitBlocks(text);
  return blocks.map((lines) => {
    const coordinates = extractCoordinates(lines);
    const contentLines = lines.filter((l) => !COORD_RE.test(l));
    const name = (contentLines[0] || "Unnamed").replace(/\*\*/g, "").trim();
    const rest = contentLines.slice(1);

    const fields = fieldDefs.map((def, i) => ({
      key: def.key,
      label: def.label,
      value: (rest[i] || "").replace(/\*\*/g, "").trim(),
    }));

    return { name, fields, coordinates, raw: lines.join("\n") };
  });
}

export default parseAiList;
