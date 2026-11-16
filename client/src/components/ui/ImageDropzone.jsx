import { useRef } from "react";
import { Camera, ImageUp } from "lucide-react";

/** Converts a File to a raw base64 string (no data: prefix), matching what
 * the backend's Gemini/analysis endpoints expect. */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageDropzone({ previewUrl, onFile, label = "Upload an image", hint }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected" className="max-h-64 rounded-xl object-contain" />
        ) : (
          <>
            <Camera size={36} className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-800">{label}</span>
            {hint && <span className="text-xs text-slate-400">{hint}</span>}
          </>
        )}
      </button>
      {previewUrl && (
        <button
          onClick={() => inputRef.current?.click()}
          className="mx-auto mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
        >
          <ImageUp size={14} /> Choose a different image
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
