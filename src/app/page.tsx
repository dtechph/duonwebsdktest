import { Suspense } from "react";
import WayfindingPage from "@/components/WayfindingPage";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center text-zinc-500">
          Loading…
        </div>
      }
    >
      <WayfindingPage />
    </Suspense>
  );
}
