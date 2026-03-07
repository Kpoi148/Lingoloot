"use client";
// Debug/output panel for inspecting generated Story Cloze JSON.

import dynamicImport from "next/dynamic";
import { Save } from "lucide-react";
import type { SaveState } from "./types";

const MonacoEditor = dynamicImport(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
  ),
});

type JsonOutputCardProps = {
  rawJson: string;
  onJsonChange: (value?: string) => void;
  onSave: () => void;
  isSaving: boolean;
  jsonError: string | null;
  saveState: SaveState;
};

export default function JsonOutputCard({
  rawJson,
  onJsonChange,
  onSave,
  isSaving,
  jsonError,
  saveState,
}: JsonOutputCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            JSON Output
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Raw Game Data
          </h2>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save to Database"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <MonacoEditor
          height="360px"
          language="json"
          theme="vs-light"
          value={rawJson}
          onChange={onJsonChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>

      {jsonError && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {jsonError}
        </div>
      )}
      {saveState.status !== "idle" && saveState.message && (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
            saveState.status === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {saveState.message}
        </div>
      )}
    </div>
  );
}
