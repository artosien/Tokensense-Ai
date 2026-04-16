"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { historyService, CalculationEntry } from "@/lib/historyService";
import { exportService } from "@/lib/exportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    FileText, 
    Table, 
    FileSpreadsheet, 
    ExternalLink, 
    Loader2, 
    History, 
    Trash2,
    Clock,
    DollarSign,
    Layers,
    Globe,
    MessageSquare
} from "lucide-react";
import { triggerHaptic } from "@/lib/utils";
import { slackService } from "@/lib/slackService";

export default function AccountHistory() {
    const { data: session } = useSession();
    const [history, setHistory] = useState<CalculationEntry[]>([]);
    const [isExportingSheets, setIsExportingSheets] = useState(false);
    const [isSharingSlack, setIsSharingSlack] = useState(false);
    const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);

    const loadHistory = () => {
        setHistory(historyService.getAll());
    };

    useEffect(() => {
        loadHistory();
        window.addEventListener('storage', loadHistory);
        return () => window.removeEventListener('storage', loadHistory);
    }, []);

    const handleClear = () => {
        if (confirm("Clear all calculation history?")) {
            historyService.clear();
            triggerHaptic(50);
        }
    };

    const handleExportCSV = () => {
        triggerHaptic(10);
        exportService.exportToCSV(history);
    };

    const handleExportExcel = () => {
        triggerHaptic(10);
        exportService.exportToExcel(history);
    };

    const handleExportPDF = () => {
        triggerHaptic(10);
        exportService.exportToPDF(history);
    };

    const handleExportGoogleSheets = async () => {
        if (!session?.user || !(session.user as any).accessToken) {
            alert("Please sign in with Google to use this feature.");
            return;
        }

        setIsExportingSheets(true);
        triggerHaptic(20);
        try {
            const url = await exportService.exportToGoogleSheets(history, (session.user as any).accessToken);
            setSheetsUrl(url);
            triggerHaptic(100);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to export to Google Sheets");
        } finally {
            setIsExportingSheets(false);
        }
    };

    const handleShareToSlack = async () => {
        const userId = (session?.user as any)?.id || session?.user?.email;
        if (!userId) {
            alert("Please sign in to share to Slack.");
            return;
        }

        const webhookUrl = localStorage.getItem(`user_slack_webhook_${userId}`);
        if (!webhookUrl) {
            alert("Slack Webhook not configured. Please add it in your Account settings.");
            return;
        }

        setIsSharingSlack(true);
        triggerHaptic(20);
        try {
            await slackService.sendCalculationHistory(webhookUrl, history);
            triggerHaptic(100);
            alert("History summary shared to Slack!");
        } catch (error: any) {
            console.error(error);
            alert("Failed to share to Slack. Check your Webhook URL.");
        } finally {
            setIsSharingSlack(false);
        }
    };

    if (history.length === 0) {
        return (
            <div className="bg-card/30 border border-border/40 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No History Yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    Start using the calculator to see your past estimations saved here automatically.
                </p>
                <Button variant="outline" className="mt-6 border-indigo-500/30 text-indigo-400" asChild>
                    <a href="/#calculate-section">Try Calculator</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Export Toolbar */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Export Data</h3>
                        <p className="text-xs text-muted-foreground">Download your {history.length} recent calculations</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-10 border-border/60 hover:bg-muted">
                            <Table className="w-4 h-4 mr-2 text-green-500" />
                            CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-10 border-border/60 hover:bg-muted">
                            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
                            Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-10 border-border/60 hover:bg-muted">
                            <FileText className="w-4 h-4 mr-2 text-red-500" />
                            PDF
                        </Button>
                        
                        <div className="h-10 w-px bg-border/40 mx-1 hidden sm:block" />

                        {!sheetsUrl ? (
                            <Button 
                                onClick={handleExportGoogleSheets} 
                                disabled={isExportingSheets}
                                className="h-10 bg-[#4285F4] hover:bg-[#357ae8] text-white font-bold"
                            >
                                {isExportingSheets ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Globe className="w-4 h-4 mr-2" />
                                )}
                                Export to Sheets
                            </Button>
                        ) : (
                            <Button variant="outline" className="h-10 border-green-500/50 text-green-500 hover:bg-green-500/10" asChild>
                                <a href={sheetsUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open Google Sheet
                                </a>
                            </Button>
                        )}

                        <Button 
                            onClick={handleShareToSlack}
                            disabled={isSharingSlack}
                            className="h-10 bg-[#4A154B] hover:bg-[#3b113c] text-white font-bold"
                        >
                            {isSharingSlack ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <MessageSquare className="w-4 h-4 mr-2" />
                            )}
                            Share to Slack
                        </Button>
                    </div>
                </div>
            </div>

            {/* History Table/List */}
            <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-400" />
                        Detailed History
                    </h3>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClear}
                        className="text-xs text-muted-foreground hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear History
                    </Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/10 text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                                <th className="px-8 py-4 font-black">Model</th>
                                <th className="px-8 py-4 font-black">Tokens</th>
                                <th className="px-8 py-4 font-black">Cost</th>
                                <th className="px-8 py-4 font-black">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {history.map((entry) => (
                                <tr key={entry.id} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground group-hover:text-indigo-400 transition-colors">
                                                {entry.modelName}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                                                {entry.promptSnippet}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="w-3 h-3 text-indigo-400/50" />
                                            <span className="text-sm font-mono font-medium">{entry.totalTokens.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-green-500/50" />
                                            <span className="text-sm font-mono font-bold text-foreground">${entry.totalCost.toFixed(4)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
