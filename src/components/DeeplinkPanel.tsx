"use client";

import { useCallback, useMemo, useState } from "react";
import {
  buildWayfindingQuery,
  type DuonMall,
} from "@dtechph/wayfinding-web";

type DeeplinkPanelProps = {
  selectedMall: DuonMall | null;
  originPoiId: string | null;
  destinationPoiId: string | null;
};

export function DeeplinkPanel({
  selectedMall,
  originPoiId,
  destinationPoiId,
}: DeeplinkPanelProps) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const mallKey = selectedMall?.slug ?? selectedMall?.buildingId ?? null;
    const qs = buildWayfindingQuery({
      mall: mallKey,
      originPoiId,
      destinationPoiId,
    });
    return qs
      ? `${window.location.origin}${window.location.pathname}?${qs}`
      : `${window.location.origin}${window.location.pathname}`;
  }, [selectedMall, originPoiId, destinationPoiId]);

  const exampleQuery = buildWayfindingQuery({
    mall: "<buildingId-or-slug>",
    originPoiId: "<origin-poi-id>",
    destinationPoiId: "<destination-poi-id>",
  });

  const copyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-zinc-800"
      >
        Deeplink (URL query parameters)
        <span className="text-xs font-normal text-zinc-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2 pb-2 text-sm text-zinc-600">
          <p>
            Open this page with{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
              mall
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
              origin
            </code>
            , and{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
              destination
            </code>{" "}
            to pre-select a mall and draw a route on embedded Situm maps.
          </p>
          <p className="font-mono text-xs text-zinc-800 break-all">
            ?{exampleQuery}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="max-w-full flex-1 truncate rounded bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-800">
              {shareUrl || "Select a mall to build a link"}
            </code>
            <button
              type="button"
              disabled={!shareUrl}
              onClick={() => void copyLink()}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
