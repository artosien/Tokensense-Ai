"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeVideoFile, analyzeVideoUrl, VideoMetadata } from "../lib/videoAnalyzer";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UploadInputProps {
  onMetadata: (metadata: VideoMetadata, file?: File) => void;
}

export function UploadInput({ onMetadata }: UploadInputProps) {
  const t = useTranslations("video_planner.input");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsAnalyzing(true);
    setError(null);
    try {
      const meta = await analyzeVideoFile(file);
      onMetadata(meta, file);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onMetadata]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".webm", ".mkv"],
    },
    multiple: false,
  });

  const handleUrlAnalyze = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const meta = await analyzeVideoUrl(url.trim());
      onMetadata(meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-3xl border-2 border-dashed p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4",
          isDragActive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-border/40 hover:border-indigo-500/30 bg-card/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2">
          <Upload className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-white">{t("upload_title")}</p>
          <p className="text-muted-foreground">{t("upload_description")}</p>
        </div>
        <p className="text-xs text-muted-foreground/60 uppercase font-mono tracking-widest mt-2">
          {t("upload_limit")}
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/40" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-mono font-bold">{t("url_divider")}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("url_placeholder")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 bg-card/50 border-border/40 focus-visible:ring-indigo-500"
            onKeyDown={(e) => e.key === "Enter" && handleUrlAnalyze()}
          />
        </div>
        <Button
          onClick={handleUrlAnalyze}
          disabled={isAnalyzing || !url.trim()}
          className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold gap-2"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : t("analyze_button")}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-400 uppercase tracking-tight">{t("error_title")}</p>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-muted-foreground animate-pulse">{t("loading_text")}</p>
        </div>
      )}
    </div>
  );
}
