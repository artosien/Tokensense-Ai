"use client";

import React from "react";
import { Mode } from "../index";
import { UploadInput } from "./UploadInput";
import { MetadataSummary } from "./MetadataSummary";
import { ConfigPanel } from "./ConfigPanel";
import { ResultsPanel } from "./ResultsPanel";
import { ApiKeySettings } from "./ApiKeySettings";
import { BatchCSVUploader } from "./BatchCSVUploader";
import { ContextWindowVisualizer } from "./ContextWindowVisualizer";
import { useVideoPlanner } from "../hooks/useVideoPlanner";
import { Video, Settings2, BarChart3, FileSpreadsheet, Download, Sparkles, TrendingDown, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { calculateTokens } from "../lib/tokenCalculator";
import { PROVIDER_MODELS } from "../lib/providerPricing";
import { VideoMetadata } from "../lib/videoAnalyzer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PlannerShellProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function PlannerShell({ mode, onModeChange }: PlannerShellProps) {
  const t = useTranslations("video_planner.shell");
  const tBatch = useTranslations("video_planner.batch");
  const tDiet = useTranslations("video_planner.diet");
  const tComp = useTranslations("video_planner.comparison");
  
  const [showBatch, setShowBatch] = React.useState(false);
  const [batchItems, setBatchItems] = React.useState<VideoMetadata[] | null>(null);
  const [compareModelId, setCompareModelId] = React.useState<string | null>(null);

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

  const batchTotalTokens = React.useMemo(() => {
    if (!batchItems) return 0;
    return batchItems.reduce((acc, item) => acc + calculateTokens(item, config).total, 0);
  }, [batchItems, config]);

  const dietSavings = React.useMemo(() => {
    if (!metadata || !breakdown) return null;
    
    // Calculate if we reduce FPS to 1
    const lowFpsConfig = { ...config, frameSamplingFps: 1 };
    const lowFpsBreakdown = calculateTokens(metadata, lowFpsConfig);
    const fpsSavings = breakdown.total - lowFpsBreakdown.total;

    // Calculate if we reduce Resolution to 480p (if current is higher)
    const isHighRes = Math.max(metadata.width, metadata.height) > 640;
    let resSavings = 0;
    if (isHighRes) {
      const lowResMeta = { ...metadata, width: 640, height: 480 };
      const lowResBreakdown = calculateTokens(lowResMeta, config);
      resSavings = breakdown.total - lowResBreakdown.total;
    }

    return { fpsSavings, resSavings };
  }, [metadata, breakdown, config]);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-10 print:gap-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t("title")}</h1>
          </div>
          <p className="text-muted-foreground font-medium">{t("description")}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-3 px-4 bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 shadow-sm"
            onClick={() => setShowBatch(true)}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] font-black uppercase tracking-widest">{t("batch_button")}</span>
                <span className="text-[10px] font-medium text-emerald-400/60 lowercase">{t("batch_desc")}</span>
              </div>
            </div>
          </Button>

          <div className="flex items-center bg-card/50 border border-border/40 rounded-2xl p-1.5 shadow-inner">
            <button
              onClick={() => onModeChange("simple")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex flex-col items-start text-left ${
                mode === "simple"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{t("mode_simple")}</span>
              <span className={cn("text-[9px] font-medium lowercase", mode === "simple" ? "text-white/70" : "text-muted-foreground/60")}>
                {t("mode_simple_desc")}
              </span>
            </button>
            <button
              onClick={() => onModeChange("advanced")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex flex-col items-start text-left ml-1 ${
                mode === "advanced"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{t("mode_advanced")}</span>
              <span className={cn("text-[9px] font-medium lowercase", mode === "advanced" ? "text-white/70" : "text-muted-foreground/60")}>
                {t("mode_advanced_desc")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showBatch && (
        <BatchCSVUploader 
          onBatchData={(items) => {
            setBatchItems(items);
            setShowBatch(false);
          }}
          onCancel={() => setShowBatch(false)}
        />
      )}

      {batchItems && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {tBatch("title")}
            </h3>
            <p className="text-sm text-muted-foreground">{tBatch("files_count", { count: batchItems.length })}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">
              {(batchTotalTokens / 1_000_000).toFixed(2)}M tokens
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Bulk Monthly Footprint</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setBatchItems(null)} 
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 h-9"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Reset Batch
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Config */}
        <div className="lg:col-span-4 space-y-8 print:hidden">
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Settings2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("config_title")}</h2>
            </div>
            {!metadata ? (
              <UploadInput onMetadata={handleMetadata} />
            ) : (
              <div className="space-y-6">
                <ConfigPanel mode={mode} config={config} onChange={setConfig} />
                
                {breakdown && (
                  <ContextWindowVisualizer 
                    model={estimates[0]?.model || PROVIDER_MODELS[0]} 
                    breakdown={breakdown} 
                  />
                )}

                {dietSavings && (dietSavings.fpsSavings > 0 || dietSavings.resSavings > 0) && (
                  <div className="space-y-4 bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                      <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">{tDiet("title")}</h3>
                    </div>
                    <div className="space-y-4">
                      {dietSavings.fpsSavings > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-muted-foreground">{tDiet("low_fps_tip")}</span>
                          <span className="text-[11px] font-black text-emerald-400 font-mono">-{Math.round(dietSavings.fpsSavings / 1000)}k tokens</span>
                        </div>
                      )}
                      {dietSavings.resSavings > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-muted-foreground">{tDiet("low_res_tip")}</span>
                          <span className="text-[11px] font-black text-emerald-400 font-mono">-{Math.round(dietSavings.resSavings / 1000)}k tokens</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <ApiKeySettings />
              </div>
            )}
          </section>
        </div>
        
        {/* Right Column: Metadata & Results */}
        <div className="lg:col-span-8 space-y-8">
          {metadata ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <section className="flex-1">
                  <div className="flex items-center gap-2 px-1">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("analysis_title")}</h2>
                  </div>
                </section>
                <div className="flex items-center gap-3">
                  <Select value={compareModelId || ""} onValueChange={setCompareModelId}>
                    <SelectTrigger className="w-[160px] h-12 text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <SelectValue placeholder={t("compare_button")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#040c0e] border-white/10">
                      {PROVIDER_MODELS.map(m => (
                        <SelectItem key={m.id} value={m.id} className="text-[10px] font-bold uppercase tracking-tight">{m.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 px-4 bg-indigo-500/5 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300"
                    onClick={handleExport}
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 shrink-0" />
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[11px] font-black uppercase tracking-widest">{t("export_pdf")}</span>
                        <span className="text-[10px] font-medium text-indigo-400/60 lowercase">{t("export_pdf_desc")}</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              
              <MetadataSummary metadata={metadata} />

              {compareModelId && breakdown && (
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/40">
                    {tComp("vs")} Comparison
                  </div>
                  
                  {/* Primary Model */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{estimates[0].model.displayName}</span>
                      <span className="text-xl font-black text-white font-mono">${estimates[0].totalCost.toFixed(4)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-full" />
                    </div>
                  </div>

                  {/* Compared Model */}
                  {(() => {
                    const compModel = PROVIDER_MODELS.find(m => m.id === compareModelId);
                    if (!compModel) return null;
                    const compCost = (breakdown.total / 1000) * compModel.inputPricePerKToken;
                    const diff = ((compCost - estimates[0].totalCost) / estimates[0].totalCost) * 100;

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase">{compModel.displayName}</span>
                          <span className="text-xl font-black text-white font-mono">${compCost.toFixed(4)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-1000", diff > 0 ? "bg-red-500" : "bg-emerald-500")} 
                            style={{ width: `${Math.max(10, Math.min(100, (compCost / estimates[0].totalCost) * 100))}%` }}
                          />
                        </div>
                        <p className={cn("text-[10px] font-bold uppercase text-right", diff > 0 ? "text-red-400" : "text-emerald-400")}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}% price difference
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

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
            <div className="h-full min-h-[400px] rounded-3xl border border-dashed border-border/40 bg-card/10 flex flex-col items-center justify-center text-center p-12 gap-4 print:hidden">
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
  );
}
