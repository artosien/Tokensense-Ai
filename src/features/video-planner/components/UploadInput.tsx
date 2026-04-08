"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Link as LinkIcon, Loader2, AlertCircle, Youtube, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="space-y-6 bg-card/30 border border-border/40 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20 p-1 h-12 rounded-2xl">
          <TabsTrigger value="url" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-bold gap-2">
            <LinkIcon className="w-4 h-4" />
            {t("tab_url")}
          </TabsTrigger>
          <TabsTrigger value="file" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-bold gap-2">
            <Upload className="w-4 h-4" />
            {t("tab_file")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <Youtube className="w-5 h-5 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">YouTube</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <div className="w-5 h-5 bg-cyan-500 rounded-sm flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Vimeo</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("url_placeholder")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-14 bg-black/40 border-border/40 focus-visible:ring-indigo-500 rounded-2xl font-medium"
                  onKeyDown={(e) => e.key === "Enter" && handleUrlAnalyze()}
                />
              </div>
              <Button
                onClick={handleUrlAnalyze}
                disabled={isAnalyzing || !url.trim()}
                className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold gap-2 rounded-2xl shadow-lg shadow-indigo-500/20"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : t("analyze_button")}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Support for high-fidelity spatial and temporal metadata extraction.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="file" className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div
            {...getRootProps()}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-8 sm:p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4",
              isDragActive
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-border/40 hover:border-indigo-500/30 bg-black/20"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-white">{t("upload_title")}</p>
              <p className="text-muted-foreground text-sm">{t("upload_description")}</p>
            </div>
            <p className="text-[10px] text-muted-foreground/60 uppercase font-mono font-bold tracking-widest mt-2">
              {t("upload_limit")}
            </p>
          </div>
        </TabsContent>
      </Tabs>

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
