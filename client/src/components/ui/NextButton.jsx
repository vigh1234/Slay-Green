import { ArrowRight } from "lucide-react";
import Button from "./Button.jsx";

export default function NextButton({ children = "Next", className = "", ...props }) {
  return (
    <div className="mt-10 flex justify-center">
      <Button className={`w-full max-w-xs ${className}`} {...props}>
        {children} <ArrowRight size={17} />
      </Button>
    </div>
  );
}
