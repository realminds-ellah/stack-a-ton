import React from "react";

interface BionicTextProps {
  text: string;
  active?: boolean;
}

export const BionicText: React.FC<BionicTextProps> = ({ text, active = true }) => {
  if (!active || !text) {
    return <>{text}</>;
  }

  // Split by whitespace
  const words = text.split(/(\s+)/);

  return (
    <>
      {words.map((part, index) => {
        // If it's pure whitespace, preserve it
        if (/^\s+$/.test(part)) {
          return <span key={index}>{part}</span>;
        }

        // Match the core word and any leading/trailing symbols/punctuation
        const match = part.match(/^([^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ-]+)?([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ-]+)?([^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ-]+)?$/);
        
        if (!match) {
          return <span key={index}>{part}</span>;
        }

        const [_, prefix = "", cleanWord = "", suffix = ""] = match;

        if (!cleanWord) {
          return <span key={index}>{part}</span>;
        }

        const len = cleanWord.length;
        // 1-3 chars: bold 1-2 letters. 4+ chars: bold 40-50%
        const boldLen = len <= 3 ? (len === 1 ? 1 : 2) : Math.ceil(len * 0.45);
        const boldPart = cleanWord.slice(0, boldLen);
        const normalPart = cleanWord.slice(boldLen);

        return (
          <span key={index} className="inline-block">
            {prefix}
            <strong className="font-extrabold text-slate-900">{boldPart}</strong>
            <span>{normalPart}</span>
            {suffix}
          </span>
        );
      })}
    </>
  );
};
