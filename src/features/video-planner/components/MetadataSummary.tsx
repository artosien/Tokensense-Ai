"use client";

import React from "react";
import { VideoMetadata } from "../lib/videoAnalyzer";
import { FileText, Clock, Maximize, Play, HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";

interface MetadataSummaryProps {
  metadata: VideoMetadata;
}

export function MetadataSummary({ metadata }: MetadataSummaryProps) {
  const t = useTranslations("video_planner.metadata");
  
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
      hrs > 0 ? hrs : null,
      hrs > 0 ? mins.toString().padStart(2, "0") : mins,
      secs.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const formatResolution = (w: number, h: number) => {
    if (w >= 3840) return t("res_4k");
    if (w >= 1920) return t("res_1080p");
    if (w >= 1280) return t("res_720p");
    if (w >= 854) return t("res_480p");
    return `${w}x${h}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatBox
        icon={<Clock className="w-4 h-4 text-indigo-400" />}
        label={t("duration")}
        value={formatDuration(metadata.durationSeconds)}
      />
      <StatBox
        icon={<Maximize className="w-4 h-4 text-purple-400" />}
        label={t("resolution")}
        value={formatResolution(metadata.width, metadata.height)}
      />
      <StatBox
        icon={<Play className="w-4 h-4 text-emerald-400" />}
        label={t("fps")}
        value={`${metadata.fps} fps`}
      />
      <StatBox
        icon={<FileText className="w-4 h-4 text-amber-400" />}
        label={t("audio")}
        value={metadata.hasAudio ? t("audio_included") : t("audio_none")}
      />
      {metadata.fileSizeMb && (
        <StatBox
          icon={<HardDrive className="w-4 h-4 text-blue-400" />}
          label={t("size")}
          value={`${metadata.fileSizeMb.toFixed(1)} MB`}
        />
      )}
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card/30 border border-border/40 rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-lg font-black text-white font-mono">{value}</span>
    </div>
  );
}
