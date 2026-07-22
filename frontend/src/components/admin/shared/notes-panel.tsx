"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export interface NoteEntry {
  id: number;
  body: string;
  authorName: string | null;
  createdAt: string;
}

export interface NotesPanelProps {
  title?: string;
  notes: NoteEntry[];
  onAddNote: (body: string) => void;
  isPending: boolean;
}

/**
 * Reusable admin notes thread — identical shape backs both Order
 * Notes and Customer Notes (the brief lists both), so one component
 * serves both rather than two near-duplicates. The caller supplies
 * `onAddNote`, wired to whichever mutation (`useAddOrderNote` /
 * `useAddCustomerNote`) is appropriate.
 */
function NotesPanel({ title = "Notes", notes, onAddNote, isPending }: NotesPanelProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    onAddNote(draft.trim());
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
      <h2 className="font-display text-heading-sm text-foreground">{title}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Add an internal note…"
          className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
        <Button type="submit" variant="outline" size="sm" isLoading={isPending} className="w-fit">
          Add Note
        </Button>
      </form>

      {notes.length === 0 ? (
        <p className="text-caption text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-hairline">
          {notes.map((note) => (
            <li key={note.id} className="flex flex-col gap-1 py-3">
              <p className="text-body-sm text-ink">{note.body}</p>
              <span className="font-mono text-caption text-muted-foreground">
                {note.authorName ?? "Admin"} — {formatDate(note.createdAt, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { NotesPanel };
