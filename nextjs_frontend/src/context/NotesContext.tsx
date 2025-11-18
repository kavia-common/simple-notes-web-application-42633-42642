"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

/**
 * Types and interfaces for Notes
 */
export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number; // epoch ms
};

type NotesState = {
  notes: Note[];
  selectedId: string | null;
  query: string;
};

type NotesAction =
  | { type: "load"; payload: { notes: Note[] } }
  | { type: "add"; payload: { note: Note } }
  | { type: "update"; payload: { note: Note } }
  | { type: "delete"; payload: { id: string } }
  | { type: "select"; payload: { id: string | null } }
  | { type: "setQuery"; payload: { query: string } };

type NotesContextValue = {
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
  filteredNotes: Note[];
};

/**
 * Reducer for notes actions
 */
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "load": {
      const notes = [...action.payload.notes].sort((a, b) => b.updatedAt - a.updatedAt);
      const selectedId = notes.length ? notes[0].id : null;
      return { ...state, notes, selectedId };
    }
    case "add": {
      const notes = [action.payload.note, ...state.notes].sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      return { ...state, notes, selectedId: action.payload.note.id };
    }
    case "update": {
      const notes = state.notes
        .map((n) => (n.id === action.payload.note.id ? action.payload.note : n))
        .sort((a, b) => b.updatedAt - a.updatedAt);
      return { ...state, notes, selectedId: action.payload.note.id };
    }
    case "delete": {
      const notes = state.notes.filter((n) => n.id !== action.payload.id);
      const selectedId = state.selectedId === action.payload.id ? (notes[0]?.id ?? null) : state.selectedId;
      return { ...state, notes, selectedId };
    }
    case "select": {
      return { ...state, selectedId: action.payload.id };
    }
    case "setQuery": {
      return { ...state, query: action.payload.query };
    }
    default:
      return state;
  }
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const STORAGE_KEY = "simple-notes-notes";

/**
 * Utilities
 */
function loadFromStorage(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    // validate shape minimally
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n.id === "string") : [];
  } catch {
    return [];
  }
}

function persistToStorage(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore quota or serialization errors
  }
}

/**
// PUBLIC_INTERFACE
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return ctx;
}

/**
// PUBLIC_INTERFACE
 */
export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    selectedId: null,
    query: "",
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const notes = loadFromStorage();
    dispatch({ type: "load", payload: { notes } });
  }, []);

  // Persist whenever notes change
  useEffect(() => {
    persistToStorage(state.notes);
  }, [state.notes]);

  const filteredNotes = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    if (!q) return state.notes;
    return state.notes.filter((n) => n.title.toLowerCase().includes(q));
  }, [state.notes, state.query]);

  const value = useMemo(() => ({ state, dispatch, filteredNotes }), [state, filteredNotes]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

/**
// PUBLIC_INTERFACE
Create a new note with default values.
 */
export function createNewNote(): Note {
  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const now = Date.now();
  return {
    id,
    title: "Untitled",
    content: "",
    updatedAt: now,
  };
}
