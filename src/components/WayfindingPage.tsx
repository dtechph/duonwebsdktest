"use client";

import { DuonMallSelector, DuonMapView } from "@dtechph/wayfinding-web";
import { SampleNav } from "@/components/SampleNav";
import { useDuonMalls } from "@/lib/useDuonMalls";

export default function WayfindingPage() {
  const { malls, selectedMall, setSelectedMall, loading, error, loadMalls } =
    useDuonMalls();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
      <SampleNav />

      <DuonMallSelector
        malls={malls}
        selectedMall={selectedMall}
        onSelect={setSelectedMall}
        loading={loading}
        error={error}
        onRetry={loadMalls}
      />

      {selectedMall ? (
        <DuonMapView mall={selectedMall} style={{ flex: 1, minHeight: 0 }} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-zinc-500">
            {loading ? "Loading…" : "Select a mall to view its map"}
          </span>
        </div>
      )}
    </div>
  );
}
