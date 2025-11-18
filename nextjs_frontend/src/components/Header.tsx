"use client";

import React from "react";

/**
// PUBLIC_INTERFACE
A themed header bar for the app.
 */
export default function Header() {
  return (
    <header
      className="sticky top-0 z-20 border-b border-blue-100/50"
      aria-label="Application header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between py-4"
          style={{ color: "var(--ocean-text)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-blue-800">
                Ocean Notes
              </h1>
              <p className="text-xs text-blue-900/60">Quick, modern, local-first</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
              Local Storage
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
              Ocean Professional
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
