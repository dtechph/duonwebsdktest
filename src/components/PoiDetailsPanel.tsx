"use client";

import type { DuonPoi } from "@dtechph/wayfinding-web";

const MAP_FIELDS: Array<{ key: keyof DuonPoi; label: string }> = [
  { key: "id", label: "POI id" },
  { key: "name", label: "Situm name" },
  { key: "floorId", label: "Floor" },
  { key: "categoryName", label: "Category" },
  { key: "categoryId", label: "Category id" },
  { key: "buildingId", label: "Building id" },
];

const TENANT_FIELDS: Array<{ key: keyof DuonPoi; label: string }> = [
  { key: "brand", label: "Brand" },
  { key: "description", label: "Description" },
  { key: "spaceNumber", label: "Space number" },
  { key: "propertyId", label: "Property ID" },
  { key: "mallName", label: "Mall name" },
  { key: "mallSlugName", label: "Mall slug" },
];

function fieldValue(poi: DuonPoi, key: keyof DuonPoi): string {
  const value = poi[key];
  if (value == null || value === "") return "—";
  return String(value);
}

function hasTenantProfile(poi: DuonPoi): boolean {
  return TENANT_FIELDS.some((field) => {
    const value = poi[field.key];
    return value != null && value !== "";
  });
}

export function PoiDetailsPanel({
  poi,
  loading,
  error,
}: {
  poi: DuonPoi | null;
  loading: boolean;
  error: string | null;
}) {
  return (
    <aside className="flex h-72 shrink-0 flex-col overflow-hidden border-t border-zinc-200 bg-white md:h-auto md:w-96 md:border-t-0 md:border-l">
      <div className="border-b border-zinc-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">Place details</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Tap a place on the map, or pick one in the search bar.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        {!poi ? (
          <p className="text-sm text-zinc-500">
            {loading
              ? "Loading places…"
              : "Select a place to see its map fields and tenant profile."}
          </p>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-lg font-semibold tracking-tight text-zinc-900">
                {poi.brand || poi.name}
              </p>
              {poi.brand && poi.brand !== poi.name ? (
                <p className="mt-0.5 text-sm text-zinc-500">{poi.name}</p>
              ) : null}
            </div>

            <FieldGroup title="Map" poi={poi} fields={MAP_FIELDS} />

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Tenant
              </h3>
              {!hasTenantProfile(poi) ? (
                <p className="mt-2 text-sm text-zinc-500">
                  This place has no linked tenant profile.
                </p>
              ) : null}
              <FieldList poi={poi} fields={TENANT_FIELDS} />
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}

function FieldGroup({
  title,
  poi,
  fields,
}: {
  title: string;
  poi: DuonPoi;
  fields: Array<{ key: keyof DuonPoi; label: string }>;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </h3>
      <FieldList poi={poi} fields={fields} />
    </section>
  );
}

function FieldList({
  poi,
  fields,
}: {
  poi: DuonPoi;
  fields: Array<{ key: keyof DuonPoi; label: string }>;
}) {
  return (
    <dl className="mt-2 divide-y divide-zinc-100">
      {fields.map((field) => (
        <div key={field.key} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2">
          <dt className="text-xs font-medium text-zinc-500">{field.label}</dt>
          <dd className="text-sm break-words text-zinc-900">
            {fieldValue(poi, field.key)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
