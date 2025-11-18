"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import NotesList from "@/components/NotesList";
import NoteEditor from "@/components/NoteEditor";
import { NotesProvider } from "@/context/NotesContext";

export default function Home() {
  // Responsive: show/hide sidebar on small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on wide screens
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setSidebarOpen(false);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return (
    <NotesProvider>
      <div
        className="min-h-screen"
        style={{
          background: "var(--ocean-background)",
          color: "var(--ocean-text)",
        }}
      >
        <Header />

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <h2 className="text-sm font-medium text-blue-900/70">Your notes</h2>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 shadow-sm hover:bg-blue-50"
              aria-expanded={sidebarOpen}
              aria-controls="notes-sidebar"
              aria-label="Toggle notes list"
            >
              {sidebarOpen ? "Hide list" : "Show list"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,360px)_1fr]">
            {/* Sidebar */}
            <div
              id="notes-sidebar"
              className={`overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-b from-blue-500/10 to-gray-50 shadow-sm transition-all ${
                sidebarOpen ? "block" : "hidden"
              } lg:block`}
            >
              <NotesList onMobileClose={() => setSidebarOpen(false)} />
            </div>

            {/* Editor */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm">
              <NoteEditor />
            </section>
          </div>
        </main>
      </div>
    </NotesProvider>
  );
}
