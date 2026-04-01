"use client";

import { useState, useEffect } from "react";
import {
  saveApiKey, getApiKey, clearApiKey, clearAllApiKeys, ProviderId, getAvailableProviders
} from "../lib/apiKeyStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck, Trash2, Key, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const PROVIDERS: { id: ProviderId; label: string; placeholder: string; docsUrl: string }[] = [
  {
    id: "google",
    label: "Google Gemini",
    placeholder: "AIza...",
    docsUrl: "https://ai.google.dev/gemini-api/docs/api-key",
  },
  {
    id: "anthropic",
    label: "Anthropic Claude",
    placeholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "openai",
    label: "OpenAI",
    placeholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
];

export function ApiKeySettings() {
  const t = useTranslations("video_planner.keys");
  const [keys, setKeys] = useState<Record<ProviderId, string>>({
    google: "", anthropic: "", openai: "",
  });
  const [revealed, setRevealed] = useState<Record<ProviderId, boolean>>({
    google: false, anthropic: false, openai: false,
  });
  const [saved, setSaved] = useState<Record<ProviderId, boolean>>({
    google: false, anthropic: false, openai: false,
  });

  // Load saved keys on mount
  useEffect(() => {
    setKeys({
      google:    getApiKey("google")    ?? "",
      anthropic: getApiKey("anthropic") ?? "",
      openai:    getApiKey("openai")    ?? "",
    });
  }, []);

  function handleSave(provider: ProviderId) {
    const key = keys[provider].trim();
    if (!key) return;
    saveApiKey(provider, key);
    setSaved(s => ({ ...s, [provider]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [provider]: false })), 2000);
  }

  function handleClear(provider: ProviderId) {
    clearApiKey(provider);
    setKeys(k => ({ ...k, [provider]: "" }));
  }

  function handleClearAll() {
    if (confirm(t("clear_all_confirm"))) {
      clearAllApiKeys();
      setKeys({ google: "", anthropic: "", openai: "" });
    }
  }

  const hasAnyKey = getAvailableProviders().length > 0;

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Key className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("title")}</h3>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-tight">{t("privacy_title")}</p>
          <p className="text-[10px] text-indigo-300/70 leading-relaxed">
            {t("privacy_description")}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {PROVIDERS.map(p => (
          <div key={p.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.label}</label>
              <a 
                href={p.docsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-bold underline underline-offset-2"
              >
                {t("get_key")}
              </a>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={revealed[p.id] ? "text" : "password"}
                  placeholder={p.placeholder}
                  value={keys[p.id]}
                  onChange={e => setKeys(k => ({ ...k, [p.id]: e.target.value }))}
                  className="bg-background/50 border-border/40 h-10 pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  onClick={() => setRevealed(r => ({ ...r, [p.id]: !r[p.id] }))}
                >
                  {revealed[p.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                size="sm"
                onClick={() => handleSave(p.id)}
                disabled={!keys[p.id] || saved[p.id]}
                className={cn(
                  "h-10 px-4 font-bold transition-all",
                  saved[p.id] ? "bg-emerald-600 hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {saved[p.id] ? t("saved") : t("save")}
              </Button>
              {getApiKey(p.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleClear(p.id)}
                  className="h-10 w-10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-border/40"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasAnyKey && (
        <div className="pt-4 border-t border-border/40">
          <button 
            onClick={handleClearAll}
            className="text-[10px] font-bold text-muted-foreground hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            <Trash2 className="w-3 h-3" />
            {t("clear_all")}
          </button>
        </div>
      )}

      {!hasAnyKey && (
        <div className="flex items-start gap-2 pt-2">
          <Info className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground italic leading-tight">
            {t("exact_measure_hint")}
          </p>
        </div>
      )}
    </div>
  );
}
