const _jsxFileName = "";import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const GlassInput = forwardRef(({ className, type, label, ...props }, ref) => {
  return (
    React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
      , label && (
        React.createElement('label', { className: "text-sm text-white/60 font-light tracking-wide"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
          , label
        )
      )
      , React.createElement('input', {
        type: type,
        className: cn(
          "w-full px-4 py-3 rounded-xl",
          "bg-white/5 backdrop-blur-xl",
          "border-b border-white/20 focus:border-amber-400/50",
          "text-white placeholder:text-white/30",
          "outline-none transition-all duration-300",
          "focus:bg-white/10 focus:ring-1 focus:ring-amber-400/30",
          className
        ),
        ref: ref,
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      )
    )
  );
});

GlassInput.displayName = "GlassInput";

export default GlassInput;
