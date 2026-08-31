"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DuonAuthError,
  DuonConfigError,
  DuonForbiddenError,
  DuonNetworkError,
  DuonWayfinding,
  type DuonMall,
} from "@dtechph/wayfinding-web";

const API_URL = process.env.NEXT_PUBLIC_DUON_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_DUON_API_KEY;

export function useDuonMalls() {
  const [malls, setMalls] = useState<DuonMall[]>([]);
  const [selectedMall, setSelectedMall] = useState<DuonMall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      DuonWayfinding.initialize({
        apiBaseUrl: API_URL ?? "",
        apiKey: API_KEY ?? "",
        platform: "web",
      });
      const list = await DuonWayfinding.fetchMalls();
      setMalls(list);
      setSelectedMall((prev) =>
        prev
          ? (list.find((m) => m.buildingId === prev.buildingId) ?? list[0] ?? null)
          : (list[0] ?? null)
      );
    } catch (err) {
      if (err instanceof DuonConfigError) {
        setError(
          "Missing or invalid Duon config. Copy .env.example to .env.local and set NEXT_PUBLIC_DUON_API_URL and NEXT_PUBLIC_DUON_API_KEY."
        );
      } else if (err instanceof DuonAuthError) {
        setError("This app's Duon API key is invalid. Please contact support.");
      } else if (err instanceof DuonForbiddenError) {
        setError("This app's Duon API key is missing map access.");
      } else if (err instanceof DuonNetworkError) {
        setError(
          `Could not reach the map service (${err.message}). Confirm NEXT_PUBLIC_DUON_API_URL and that the backend is running.`
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to load malls");
      }
      setMalls([]);
      setSelectedMall(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMalls();
    return () => {
      DuonWayfinding.endTelemetrySession();
    };
  }, [loadMalls]);

  return { malls, selectedMall, setSelectedMall, loading, error, loadMalls };
}
