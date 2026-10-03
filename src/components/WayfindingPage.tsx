"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DuonMallSelector,
  DuonMapView,
  buildWayfindingQuery,
  fetchPois,
  findMallForQuery,
  parseWayfindingQuery,
  type DuonMall,
  type DuonPoi,
} from "@dtechph/wayfinding-web";
import { DeeplinkPanel } from "@/components/DeeplinkPanel";
import { PoiDetailsPanel } from "@/components/PoiDetailsPanel";
import { SampleNav } from "@/components/SampleNav";
import { useDuonMalls } from "@/lib/useDuonMalls";

type RouteIds = { fromPoiId: string | null; toPoiId: string | null };

function changedPoiId(previous: RouteIds, next: RouteIds): string | null {
  if (next.toPoiId !== previous.toPoiId) return next.toPoiId;
  if (next.fromPoiId !== previous.fromPoiId) return next.fromPoiId;
  return null;
}

function mallQueryKey(mall: DuonMall): string {
  return mall.slug ?? mall.buildingId;
}

/** Map taps omit tenant fields. Overlay only defined values onto the catalog POI. */
function joinPoi(catalog: DuonPoi | undefined, partial?: DuonPoi): DuonPoi | null {
  if (!catalog && !partial) return null;
  const base = catalog ?? partial;
  if (!base) return null;
  if (!catalog || !partial) return base;
  const merged: DuonPoi = { ...catalog };
  (Object.keys(partial) as Array<keyof DuonPoi>).forEach((key) => {
    const value = partial[key];
    if (value != null && value !== "") {
      Object.assign(merged, { [key]: value });
    }
  });
  return merged;
}

export default function WayfindingPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { malls, selectedMall, setSelectedMall, loading, error, loadMalls } =
    useDuonMalls();
  const [pois, setPois] = useState<DuonPoi[]>([]);
  const [poisLoading, setPoisLoading] = useState(false);
  const [poiError, setPoiError] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<DuonPoi | null>(null);
  const [originPoiId, setOriginPoiId] = useState<string | null>(null);
  const [destinationPoiId, setDestinationPoiId] = useState<string | null>(null);
  const poisRef = useRef<DuonPoi[]>([]);
  const selectedIdRef = useRef<string | null>(null);
  const routeRef = useRef<RouteIds>({ fromPoiId: null, toPoiId: null });

  const syncUrl = useCallback(
    (mall: DuonMall | null, route: RouteIds) => {
      const qs = buildWayfindingQuery({
        mall: mall ? mallQueryKey(mall) : null,
        originPoiId: route.fromPoiId,
        destinationPoiId: route.toPoiId,
      });
      const next = qs ? `${pathname}?${qs}` : pathname;
      router.replace(next, { scroll: false });
    },
    [pathname, router]
  );

  const showPoi = useCallback((id: string, partial?: DuonPoi) => {
    selectedIdRef.current = id;
    const full = poisRef.current.find((item) => item.id === id);
    setSelectedPoi(joinPoi(full, partial ?? { id, name: id }));
  }, []);

  useEffect(() => {
    if (!malls.length) return;
    const query = parseWayfindingQuery(searchParams.toString());
    if (!query.mall) return;
    const mall = findMallForQuery(malls, query.mall);
    if (mall) setSelectedMall(mall);
  }, [malls, searchParams, setSelectedMall]);

  useEffect(() => {
    const query = parseWayfindingQuery(searchParams.toString());
    setOriginPoiId(query.originPoiId);
    setDestinationPoiId(query.destinationPoiId);
    routeRef.current = {
      fromPoiId: query.originPoiId,
      toPoiId: query.destinationPoiId,
    };
  }, [searchParams]);

  useEffect(() => {
    routeRef.current = { fromPoiId: null, toPoiId: null };
    selectedIdRef.current = null;
    setSelectedPoi(null);
    poisRef.current = [];
    setPois([]);
    setPoiError(null);

    if (!selectedMall) return;

    let cancelled = false;
    setPoisLoading(true);
    fetchPois(selectedMall)
      .then((list) => {
        if (cancelled) return;
        poisRef.current = list;
        setPois(list);
      })
      .catch(() => {
        if (!cancelled) {
          setPoiError("Could not load place details for this mall.");
        }
      })
      .finally(() => {
        if (!cancelled) setPoisLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMall]);

  useEffect(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    const full = pois.find((item) => item.id === id);
    if (!full) return;
    setSelectedPoi((current) =>
      current?.id === id ? joinPoi(full, current) : full
    );
  }, [pois]);

  const handleMallSelect = useCallback(
    (mall: DuonMall) => {
      setSelectedMall(mall);
      const cleared: RouteIds = { fromPoiId: null, toPoiId: null };
      routeRef.current = cleared;
      setOriginPoiId(null);
      setDestinationPoiId(null);
      syncUrl(mall, cleared);
    },
    [setSelectedMall, syncUrl]
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
      <SampleNav />

      <DuonMallSelector
        malls={malls}
        selectedMall={selectedMall}
        onSelect={handleMallSelect}
        loading={loading}
        error={error}
        onRetry={loadMalls}
      />

      <DeeplinkPanel
        selectedMall={selectedMall}
        originPoiId={originPoiId}
        destinationPoiId={destinationPoiId}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {selectedMall ? (
          <DuonMapView
            mall={selectedMall}
            mode="embedded"
            style={{ flex: 1, minWidth: 0, minHeight: 0, width: "auto" }}
            originPoiId={originPoiId}
            destinationPoiId={destinationPoiId}
            onPoiSelected={(poi) => showPoi(poi.id, poi)}
            onRouteChange={(route) => {
              const id = changedPoiId(routeRef.current, route);
              routeRef.current = route;
              setOriginPoiId(route.fromPoiId);
              setDestinationPoiId(route.toPoiId);
              syncUrl(selectedMall, route);
              if (id) showPoi(id);
            }}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-zinc-500">
              {loading ? "Loading…" : "Select a mall to view its map"}
            </span>
          </div>
        )}

        <PoiDetailsPanel
          poi={selectedPoi}
          loading={poisLoading}
          error={poiError}
        />
      </div>
    </div>
  );
}
