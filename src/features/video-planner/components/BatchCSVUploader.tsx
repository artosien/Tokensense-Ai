"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, Upload, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { VideoMetadata } from "../lib/videoAnalyzer";

interface BatchCSVUploaderProps {
  onBatchData: (items: VideoMetadata[]) => void;
  onCancel: () => void;
}

export function BatchCSVUploader({ onBatchData, onCancel }: BatchCSVUploaderProps) {
  const t = useTranslations("video_planner.batch");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCSV = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) throw new Error("CSV is empty or missing headers");

      const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
      const durationIdx = headers.indexOf("duration");
      const resolutionIdx = headers.indexOf("resolution");
      const nameIdx = headers.indexOf("name") !== -1 ? headers.indexOf("name") : headers.indexOf("filename");

      if (durationIdx === -1 || resolutionIdx === -1) {
        throw new Error("CSV must have 'duration' (seconds) and 'resolution' (e.g. 1080p) columns");
      }

      const results: VideoMetadata[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(",");
        const duration = parseFloat(cols[durationIdx]);
        const res = cols[resolutionIdx].toLowerCase().trim();
        const name = nameIdx !== -1 ? cols[nameIdx] : `Video ${i}`;

        if (isNaN(duration)) continue;

        // Map resolution string to width/height for the calculator
        let width = 1280, height = 720;
        if (res.includes("480")) { width = 640; height = 480; }
        else if (res.includes("360")) { width = 480; height = 360; }
        else if (res.includes("1080")) { width = 1920; height = 1080; }
        else if (res.includes("4k")) { width = 3840; height = 2160; }

        results.push({
          durationSeconds: duration,
          width,
          height,
          fps: 30, // Default for batch
          hasAudio: true, // Assume true for batch
          audioDurationSeconds: duration,
          source: "batch",
          name
        });
      }

      if (results.length === 0) throw new Error("No valid video data found in CSV");
      onBatchData(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) processCSV(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div className="space-y-6 p-8 bg-card border border-border/40 rounded-3xl animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Batch CSV Estimator
          </h3>
          <p className="text-sm text-muted-foreground">Upload a CSV with 'name', 'duration', and 'resolution'.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3",
          isDragActive ? "border-emerald-500 bg-emerald-500/10" : "border-border/40 hover:border-emerald-500/30 bg-background/50"
        )}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        ) : (
          <Upload className="w-10 h-10 text-emerald-400" />
        )}
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Click or drag CSV here</p>
          <p className="text-xs text-muted-foreground">Supports up to 500 rows for bulk estimation.</p>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[11px] text-emerald-400/80 font-mono">
        <p className="font-bold mb-1 uppercase tracking-widest text-emerald-400">CSV Template Example:</p>
        <code>name,duration,resolution</code><br/>
        <code>video1.mp4,60,1080p</code><br/>
        <code>video2.mov,120,720p</code>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
