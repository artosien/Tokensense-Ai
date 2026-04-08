"use client";

import React, { useState } from "react";
import { Key, History, BarChart3, TrendingDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ApiIntegrationSectionProps {
    variant?: "default" | "hero";
}

export function ApiIntegrationSection({ variant = "default" }: ApiIntegrationSectionProps) {
    const t = useTranslations("api_sync");
    const [showAPIIntegration, setShowAPIIntegration] = useState(false);

    if (variant === "hero") {
        return (
            <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm">{t("benefit")}</span>
                </div>
                <Button 
                    variant="outline" 
                    className="group h-12 px-6 rounded-2xl border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-indigo-400 transition-all duration-300 font-bold gap-2 shadow-lg shadow-indigo-500/5"
                    onClick={() => setShowAPIIntegration(!showAPIIntegration)}
                >
                    <Key className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    {t("config_cta")}
                </Button>

                {showAPIIntegration && (
                    <div className="w-full max-w-md mt-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-card/90 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-2xl relative z-20">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-white font-bold">{t("title")}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{t("desc")}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setShowAPIIntegration(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("label")}</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="password"
                                            placeholder={t("placeholder")}
                                            className="bg-black/40 border-white/10 h-10"
                                        />
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 font-bold">{t("connect")}</Button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic border-t border-white/5 pt-3">
                                    {t("note")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-8 overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all"
                onClick={() => setShowAPIIntegration(!showAPIIntegration)}
            >                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Key className="w-24 h-24 text-indigo-400" />
                </div>
                
                <div className="relative space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                        {t("badge")}
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{t("title")}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {t("desc")}
                    </p>
                    
                    {showAPIIntegration ? (
                        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("label")}</label>
                                <div className="flex gap-2">
                                    <Input 
                                        type="password" 
                                        placeholder={t("placeholder")} 
                                        className="bg-black/40 border-white/10 h-12 focus-visible:ring-indigo-500 font-mono"
                                    />
                                    <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold">{t("connect")}</Button>
                                </div>
                                <p className="text-[10px] text-slate-500 italic">{t("note")}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <History className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">{t("hist_title")}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{t("hist_desc")}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <BarChart3 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">{t("acc_title")}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{t("acc_desc")}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">{t("alert_title")}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{t("alert_desc")}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-bold gap-2">
                            <Key className="w-4 h-4" />
                            {t("config_cta")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
