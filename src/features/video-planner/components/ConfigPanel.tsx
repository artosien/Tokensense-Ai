"use client";

import React from "react";
import { TokenConfig } from "../lib/tokenCalculator";
import { Mode } from "../index";
import { USE_CASE_PRESETS } from "../lib/useCasePresets";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ConfigPanelProps {
  mode: Mode;
  config: TokenConfig;
  onChange: (config: TokenConfig) => void;
}

export function ConfigPanel({ mode, config, onChange }: ConfigPanelProps) {
  const t = useTranslations("video_planner.config");
  const tSamples = useTranslations("samples");

  const handleUseCaseChange = (presetKey: string) => {
    const preset = USE_CASE_PRESETS[presetKey];
    if (preset) {
      onChange({ ...config, promptTokens: preset.promptTokens });
    }
  };

  const getPresetLabel = (key: string) => {
    // Map preset keys to samples keys if they exist
    const keyMap: Record<string, string> = {
      summarize: "light_label",
      qa: "medium_label",
      description: "heavy_label",
    };
    
    const sampleKey = keyMap[key];
    if (sampleKey) {
      try {
        return tSamples(sampleKey as any);
      } catch (e) {
        // Fallback if translation fails
        return USE_CASE_PRESETS[key].label;
      }
    }
    
    return USE_CASE_PRESETS[key].label;
  };

  return (
    <div className="space-y-8 bg-card border border-border/40 rounded-3xl p-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("title")}</h3>
        <p className="text-xs text-muted-foreground">{t("description")}</p>
      </div>

      {mode === "simple" ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground uppercase">{t("i_want_to")}</Label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(USE_CASE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleUseCaseChange(key)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-medium",
                    config.promptTokens === preset.promptTokens
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-border/40 hover:border-border/60 text-muted-foreground"
                  )}
                >
                  {getPresetLabel(key)}
                  {config.promptTokens === preset.promptTokens && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-muted-foreground uppercase">{t("sampling_rate")}</Label>
              <span className="font-mono text-sm text-white font-bold bg-indigo-500/20 px-2 py-0.5 rounded">
                {config.frameSamplingFps} fps
              </span>
            </div>
            <Slider
              value={[config.frameSamplingFps]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={([val]) => onChange({ ...config, frameSamplingFps: val })}
              className="py-4"
            />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t("sampling_hint")}
              <span className="text-indigo-400 ml-1">{t("sampling_recommendation")}</span>
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold text-muted-foreground uppercase">{t("prompt_tokens")}</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={config.promptTokens}
                onChange={(e) => onChange({ ...config, promptTokens: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-background/50 border-border/40 font-mono text-white h-10"
              />
              <span className="text-xs text-muted-foreground uppercase font-mono">{t("tokens_unit")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-border/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold text-white">{t("process_audio")}</Label>
            <p className="text-[10px] text-muted-foreground">{t("process_audio_desc")}</p>
          </div>
          <Switch
            checked={config.includeAudio}
            onCheckedChange={(val) => onChange({ ...config, includeAudio: val })}
          />
        </div>
      </div>
    </div>
  );
}
