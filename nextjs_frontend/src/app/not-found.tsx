import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ocean-background)" }}>
      <section className="w-full max-w-lg rounded-xl border border-blue-100 bg-white p-8 text-center shadow-sm" role="alert" aria-live="assertive">
        <header className="mb-2">
          <h1 className="text-2xl font-semibold text-blue-900">404 – Page Not Found</h1>
          <p className="mt-1 text-sm text-blue-900/60">The page you’re looking for doesn’t exist.</p>
        </header>
        <Link href="/" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700">
          Go Home
        </Link>
      </section>
    </main>
  );
}
