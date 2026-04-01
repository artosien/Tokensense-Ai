"use client";

import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { Mode } from "../index";
import { UploadInput } from "./UploadInput";
import { MetadataSummary } from "./MetadataSummary";
import { ConfigPanel } from "./ConfigPanel";
import { ResultsPanel } from "./ResultsPanel";
import { ApiKeySettings } from "./ApiKeySettings";
import { useVideoPlanner } from "../hooks/useVideoPlanner";
import { Video, Settings2, BarChart3, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface PlannerShellProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function PlannerShell({ mode, onModeChange }: PlannerShellProps) {
  const t = useTranslations("video_planner.shell");
  const {
    metadata,
    config,
    setConfig,
    breakdown,
    estimates,
    recommendation,
    handleMetadata,
    handleMeasureExactly,
    isMeasuring,
    hasApiKeys,
    reset,
  } = useVideoPlanner();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-10">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">{t("title")}</h1>
              </div>
              <p className="text-muted-foreground font-medium">{t("description")}</p>
            </div>
            
            <div className="flex items-center bg-card border border-border/40 rounded-xl p-1 w-fit">
              <button
                onClick={() => onModeChange("simple")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === "simple"
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("mode_simple")}
              </button>
              <button
                onClick={() => onModeChange("advanced")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === "advanced"
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("mode_advanced")}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input & Config */}
            <div className="lg:col-span-4 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("config_title")}</h2>
                </div>
                {!metadata ? (
                  <UploadInput onMetadata={handleMetadata} />
                ) : (
                  <div className="space-y-6">
                    <ConfigPanel mode={mode} config={config} onChange={setConfig} />
                    <ApiKeySettings />
                  </div>
                )}
              </section>
            </div>
            
            {/* Right Column: Metadata & Results */}
            <div className="lg:col-span-8 space-y-8">
              {metadata ? (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("analysis_title")}</h2>
                    </div>
                    <MetadataSummary metadata={metadata} />
                  </section>

                  <section className="space-y-4">
                    {breakdown && (
                      <ResultsPanel
                        breakdown={breakdown}
                        estimates={estimates}
                        recommendation={recommendation}
                        onMeasureExactly={handleMeasureExactly}
                        isMeasuring={isMeasuring}
                        hasApiKeys={hasApiKeys}
                        onReset={reset}
                      />
                    )}
                  </section>
                </div>
              ) : (
                <div className="h-full min-h-[400px] rounded-3xl border border-dashed border-border/40 bg-card/10 flex flex-col items-center justify-center text-center p-12 gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-2">
                    <Video className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <div className="max-w-sm space-y-2">
                    <h3 className="text-xl font-bold text-white/60">{t("no_video_title")}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("no_video_description")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Disclaimer */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40 mt-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{t("privacy_title")}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("privacy_description")}
            </p>
          </div>
          <div className="flex flex-col gap-2 md:text-right">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest font-bold">{t("methodology_title")}</p>
            <p className="text-[10px] text-muted-foreground/60 max-w-xs md:ml-auto">
              {t("methodology_description")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
