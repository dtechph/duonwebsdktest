"use client";

import {
  DuonMapView,
  DuonWayfinding,
  type DuonMall,
  type DuonMapRenderMode,
} from "@dtechph/wayfinding-web";
import { SampleNav } from "@/components/SampleNav";
import { useDuonMalls } from "@/lib/useDuonMalls";

function MallPicker({
  malls,
  selectedMall,
  onSelect,
}: {
  malls: DuonMall[];
  selectedMall: DuonMall | null;
  onSelect: (mall: DuonMall) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {malls.map((mall) => {
        const selected = mall.buildingId === selectedMall?.buildingId;
        return (
          <button
            key={mall.buildingId}
            type="button"
            onClick={() => {
              DuonWayfinding.setActiveMall(mall);
              onSelect(mall);
            }}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              selected
                ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
            }`}
          >
            <span className="block font-medium">{mall.name}</span>
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              {mall.mapType}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const MODE_COPY = {
  embedded: {
    eyebrow: "Embedded · controlled size",
    body: (
      <>
        Situm malls get origin/destination routing. Give{" "}
        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[0.9em]">
          DuonMapView
        </code>{" "}
        an explicit height when it is not the full page. This sample drops it
        into a card at 480px, with a custom mall picker that calls{" "}
        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[0.9em]">
          setActiveMall
        </code>
        .
      </>
    ),
  },
  iframe: {
    eyebrow: "Iframe · controlled size",
    body: (
      <>
        Opaque viewer iframe with no routing chrome. Same 480px card layout as
        the embedded sample, but{" "}
        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[0.9em]">
          {`mode="iframe"`}
        </code>{" "}
        always loads the hosted viewer URL.
      </>
    ),
  },
} as const;

export default function EmbeddedMapSample({
  mode,
}: {
  mode: Extract<DuonMapRenderMode, "embedded" | "iframe">;
}) {
  const { malls, selectedMall, setSelectedMall, loading, error, loadMalls } =
    useDuonMalls();
  const copy = MODE_COPY[mode];

  return (
    <div className="min-h-dvh bg-zinc-50">
      <SampleNav />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          {copy.eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Find a mall
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600">{copy.body}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900">Malls</h3>
            <div className="mt-3">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading malls…</p>
              ) : error ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={() => void loadMalls()}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
                  >
                    Retry
                  </button>
                </div>
              ) : malls.length === 0 ? (
                <p className="text-sm text-zinc-500">No malls available</p>
              ) : (
                <MallPicker
                  malls={malls}
                  selectedMall={selectedMall}
                  onSelect={setSelectedMall}
                />
              )}
            </div>
          </aside>

          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-4 py-3">
              <p className="text-sm font-medium text-zinc-900">
                {selectedMall?.name ?? "Map"}
              </p>
              <p className="text-xs text-zinc-500">
                <code className="font-mono">{`mode="${mode}"`}</code>
                {" · "}
                <code className="font-mono">{`style={{ height: 480 }}`}</code>
              </p>
            </div>
            {selectedMall ? (
              <DuonMapView
                mall={selectedMall}
                mode={mode}
                showRoutePicker={mode === "embedded"}
                style={{ height: 480 }}
              />
            ) : (
              <div className="flex h-[480px] items-center justify-center bg-zinc-100">
                <span className="text-sm text-zinc-500">
                  {loading ? "Loading…" : "Select a mall to view its map"}
                </span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
