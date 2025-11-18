"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNotes } from "@/context/NotesContext";

/**
// PUBLIC_INTERFACE
Note editor area for viewing and editing the selected note.
 */
export default function NoteEditor() {
  const { state, dispatch } = useNotes();
  const note = useMemo(
    () => state.notes.find((n) => n.id === state.selectedId) ?? null,
    [state.notes, state.selectedId]
  );

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const titleRef = useRef<HTMLInputElement>(null);

  // Sync local state when the selected note changes
  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note?.id, note?.title, note?.content]);

  // Debounced persist of edits to the global notes state
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => {
      dispatch({
        type: "update",
        payload: {
          note: { ...note, title: title.trim(), content, updatedAt: Date.now() },
        },
      });
    }, 300);
    return () => clearTimeout(t);
  }, [title, content, note, dispatch]);

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-blue-300/60 bg-gradient-to-b from-blue-50/40 to-gray-50 p-8 shadow-sm">
          <h2 className="text-lg font-medium text-blue-900">No note selected</h2>
          <p className="mt-2 text-sm text-blue-900/60">
            Create a new note or select one from the list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col">
      <div className="border-b border-blue-100/60 bg-white/70 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="flex items-center gap-2">
          <label htmlFor="note-title" className="sr-only">
            Note title
          </label>
          <input
            id="note-title"
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-blue-200/60 bg-white px-3 py-2 text-base font-medium text-blue-900 shadow-sm outline-none focus:border-blue-400 focus:shadow-blue-500/10"
          />
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor="note-content" className="sr-only">
          Note content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          className="h-full min-h-[300px] w-full resize-none bg-white p-4 outline-none"
          style={{
            lineHeight: 1.6,
          }}
          aria-label="Note content"
        />
      </div>
    </section>
  );
}
