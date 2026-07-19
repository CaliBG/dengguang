"use client";

import dynamic from "next/dynamic";
import { MorsLightLoading } from "./light/MorsPageSurface";

const MorsLightCanvas = dynamic(
  () => import("./light/MorsLightCanvas").then((module) => module.MorsLightCanvas),
  {
    loading: MorsLightLoading,
    ssr: false,
  },
);

export function MorsLightExperience() {
  return <MorsLightCanvas />;
}
