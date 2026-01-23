const _jsxFileName = ""; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { cn } from "@/lib/utils";
import { Upload, X, FileText } from "lucide-react";
import React, { useRef, useState } from "react";

export default function GlassUpload({ label, onUpload, value, className, ...props }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    _optionalChain([inputRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.click, 'call', _3 => _3()]);
  };

  const handleChange = (e) => {
    const file = _optionalChain([e, 'access', _4 => _4.target, 'access', _5 => _5.files, 'optionalAccess', _6 => _6[0]]);
    if (file) {
      setFileName(file.name);
      // Create a fake local URL for preview or read as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onUpload) {
          onUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
    if (onUpload) onUpload(null);
  };

  return (
    React.createElement('div', {
      onClick: handleClick,
      className: cn(
        "relative group cursor-pointer flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 transition-all duration-300",
        value ? "border-primary/50 bg-primary/5" : "",
        className
      ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}

      , React.createElement('input', {
        type: "file",
        className: "hidden",
        ref: inputRef,
        onChange: handleChange,
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
      )

      , value ? (
        React.createElement('div', { className: "relative w-full h-full flex flex-col items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
             , typeof value === 'string' && value.startsWith('data:image') ? (
                 React.createElement('img', { src: value, alt: "Preview", className: "max-h-32 rounded-lg mb-2 object-contain"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}} )
             ) : (
                React.createElement(FileText, { className: "w-10 h-10 text-primary mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
             )
             , React.createElement('p', { className: "text-sm text-white/80 truncate max-w-[200px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}, fileName || "File selected")
             , React.createElement('button', { 
                onClick: handleClear,
                className: "absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}

                , React.createElement(X, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}} )
             )
        )
      ) : (
        React.createElement(React.Fragment, null
          , React.createElement('div', { className: "p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            , React.createElement(Upload, { className: "w-6 h-6 text-white/60 group-hover:text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}} )
          )
          , React.createElement('span', { className: "text-sm font-medium text-white/60 group-hover:text-white transition-colors"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
            , label || "Upload File"
          )
        )
      )
    )
  );
}
