import { Fragment } from "react";

export interface HighlightTextProps {
  text: string;
  query: string;
}

/**
 * Bolds every case-insensitive occurrence of `query` within `text` —
 * the "Highlight matched keywords" requirement for advanced search.
 * Escapes regex special characters in the query first so a search
 * like "2+2" or "(new)" doesn't throw rather than just not matching.
 */
function HighlightText({ text, query }: HighlightTextProps) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={index} className="bg-brass/30 text-ink">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export { HighlightText };
