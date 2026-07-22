"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/** Press Enter or comma to add a tag; backspace on an empty input removes the last one — the standard tag-input interaction pattern. */
function TagInput({ value, onChange, placeholder = "Add a tag and press Enter" }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const cleaned = draft.trim();
    if (cleaned && !value.includes(cleaned)) {
      onChange([...value, cleaned]);
    }
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-hairline bg-canvas p-2">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 rounded-pill bg-ink/5 px-2.5 py-1 font-mono text-caption text-ink"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            onClick={() => onChange(value.filter((item) => item !== tag))}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-body-sm focus-visible:outline-none"
      />
    </div>
  );
}

export { TagInput };
