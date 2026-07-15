import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

export function lazyNamed<P = object>(
  loader: () => Promise<Record<string, ComponentType<P>>>,
  exportName: string,
  label?: string,
) {
  return dynamic(
    () => loader().then((mod) => ({ default: mod[exportName] as ComponentType<P> })),
    {
      loading: () => <DashboardLoading label={label} />,
      ssr: false,
    },
  );
}
