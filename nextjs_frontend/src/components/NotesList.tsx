"use client";

import React, { useMemo, useState } from "react";
import { createNewNote, useNotes } from "@/context/NotesContext";

/**
// PUBLIC_INTERFACE
Sidebar notes list with search, selection, add and delete controls.
 */
export default function NotesList({
  onMobileClose,
}: {
  onMobileClose?: () => void;
}) {
  const { state, dispatch, filteredNotes } = useNotes();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    const n = createNewNote();
    dispatch({ type: "add", payload: { note: n } });
    if (onMobileClose) onMobileClose();
  };

  const displayed = filteredNotes;

  const selectedIndex = useMemo(
    () => displayed.findIndex((n) => n.id === state.selectedId),
    [displayed, state.selectedId]
  );

  return (
    <aside
      className="flex h-full flex-col"
      aria-label="Notes list"
    >
      <div className="flex items-center gap-2 p-3 border-b border-blue-100/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <label htmlFor="search" className="sr-only">
          Search notes
        </label>
        <div className="flex-1 relative">
          <input
            id="search"
            name="search"
            type="text"
            value={state.query}
            onChange={(e) => dispatch({ type: "setQuery", payload: { query: e.target.value } })}
            placeholder="Search notes…"
            className="w-full rounded-lg border border-blue-200/60 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-blue-400 focus:shadow-blue-500/10"
            aria-label="Search notes by title"
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-blue-400">
            <svg width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398l3.85 3.85 1.398-1.4-3.85-3.848zM6.5 11a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
            </svg>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          aria-label="Add new note"
        >
          <span className="text-lg leading-none">＋</span> New
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto p-2" role="listbox" aria-label="Notes">
        {displayed.length === 0 ? (
          <li className="p-4 text-sm text-blue-900/60">No notes yet. Create your first note.</li>
        ) : (
          displayed.map((note) => {
            const selected = state.selectedId === note.id;
            return (
              <li
                key={note.id}
                role="option"
                aria-selected={selected}
                className={`group relative mb-2 rounded-lg border bg-white p-3 shadow-sm transition ${
                  selected
                    ? "border-blue-400 ring-1 ring-blue-300/50 shadow-blue-500/10"
                    : "border-blue-100 hover:border-blue-200"
                }`}
              >
                <button
                  onClick={() => {
                    dispatch({ type: "select", payload: { id: note.id } });
                    if (onMobileClose) onMobileClose();
                  }}
                  className="block w-full text-left"
                >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="line-clamp-1 font-medium text-blue-900">
                          {note.title || "Untitled"}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-blue-900/60">
                          {note.content || "No content"}
                        </div>
                      </div>
                      <time
                        className="shrink-0 text-[10px] text-blue-900/50"
                        dateTime={new Date(note.updatedAt).toISOString()}
                      >
                        {formatRelative(note.updatedAt)}
                      </time>
                    </div>
                </button>

                <div className="mt-2 flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  {confirmDeleteId === note.id ? (
                    <>
                      <button
                        className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                        onClick={() => setConfirmDeleteId(null)}
                        aria-label="Cancel delete"
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white shadow hover:bg-red-700"
                        onClick={() => {
                          dispatch({ type: "delete", payload: { id: note.id } });
                          setConfirmDeleteId(null);
                        }}
                        aria-label="Confirm delete"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="rounded-md bg-white px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                      onClick={() => setConfirmDeleteId(note.id)}
                      aria-label="Delete note"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>

      {displayed.length > 0 && selectedIndex >= 0 && (
        <div className="border-t border-blue-100/60 p-2 text-[11px] text-blue-900/50">
          {selectedIndex + 1} of {displayed.length} selected
        </div>
      )}
    </aside>
  );
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (diff < min) return "Just now";
  if (diff < hr) return `${Math.floor(diff / min)}m ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  return new Date(ts).toLocaleDateString();
}
