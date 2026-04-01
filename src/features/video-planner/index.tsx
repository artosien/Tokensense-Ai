"use client";

import { useState } from "react";
import { PlannerShell } from "./components/PlannerShell";

export type Mode = "simple" | "advanced";

export function VideoPlanner() {
  const [mode, setMode] = useState<Mode>("simple");
  return <PlannerShell mode={mode} onModeChange={setMode} />;
}
