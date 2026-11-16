/** Parses "Label: value" lines (one per line) into a { LabelNoSpaces: value } map. */
export function parseKeyValueText(text) {
  if (!text) return {};
  const clean = text.replace(/\*+/g, "");
  return clean.split("\n").reduce((acc, line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return acc;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && value) acc[key.replace(/\s+/g, "")] = value;
    return acc;
  }, {});
}

export default parseKeyValueText;
