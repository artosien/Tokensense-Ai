"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { useTokenSenseStore } from "@/lib/store";
import { countTokens } from "@/lib/tokenizer";

// Type definition for an attached file
interface AttachedFile {
    id: string;
    name: string;
    size: number;
    text: string;           // extracted content
    tokenCount: number | null; // null means parsing is in progress
    error?: string;
}

export default function FileContextUploader() {
    const { setFileTokenCount, setFileText } = useTokenSenseStore();
    const [files, setFiles] = useState<AttachedFile[]>([]);

    // Recalculates the total tokens and combined text for the global store
    useEffect(() => {
        const totalTokens = files.reduce(
            (sum, f) => sum + (f.tokenCount || 0),
            0
        );
        const combinedText = files
            .map((f) => `--- FILE: ${f.name} ---\n${f.text}\n`)
            .join("\n");

        setFileTokenCount(totalTokens);
        setFileText(combinedText);
    }, [files, setFileTokenCount, setFileText]);

    // Add a file placeholder in a "loading" state
    const addFilePlaceholder = useCallback((file: File): string => {
        const id = crypto.randomUUID();
        setFiles((prev) => {
            const newFiles = [
                ...prev,
                {
                    id,
                    name: file.name,
                    size: file.size,
                    text: "",
                    tokenCount: null, // Indicates loading
                },
            ];
            return newFiles;
        });
        return id;
    }, []);

    // Update the file once parsing is complete
    const updateFileAfterParsing = useCallback((
        id: string,
        updates: Partial<AttachedFile>
    ) => {
        setFiles((prev) => {
            return prev.map((f) =>
                f.id === id ? { ...f, ...updates } : f
            );
        });
    }, []);

    // Remove a file from the list
    const removeFile = (id: string) => {
        setFiles((prev) => {
            return prev.filter((f) => f.id !== id);
        });
    };

    // Document parser (Text/PDF)
    const parseFileContent = useCallback(async (file: File): Promise<string> => {
        const isPdf =
            file.type === "application/pdf" || file.name.endsWith(".pdf");

        if (isPdf) {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items
                    .filter(
                        (item) => "str" in item && typeof item.str === "string"
                    )
                    .map((item) => (item as { str: string }).str);
                fullText += strings.join(" ") + "\n";
            }
            return fullText.trim();
        } else {
            // Assume text or code file
            try {
                return await file.text();
            } catch (err) {
                console.error("FileReader failed:", err);
                throw new Error("Unsupported binary format. Please use text, code, or PDF files.");
            }
        }
    }, []);

    // Callback when files are dropped or selected
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                // Ignore empty or overly large files proactively if desired, but here we just process.
                const id = addFilePlaceholder(file);

                try {
                    const text = await parseFileContent(file);
                    const tokens = await countTokens(text);
                    updateFileAfterParsing(id, { text, tokenCount: tokens });
                } catch (err: unknown) {
                    updateFileAfterParsing(id, {
                        error: err instanceof Error ? err.message : "Failed to parse file",
                        tokenCount: 0,
                    });
                }
            }
        },
        [addFilePlaceholder, parseFileContent, updateFileAfterParsing]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // Accept common text-based and PDF formats
        accept: {
            "text/plain": [".txt", ".md", ".csv"],
            "application/pdf": [".pdf"],
            "application/json": [".json"],
            "text/javascript": [".js", ".jsx", ".ts", ".tsx"],
            "text/x-python": [".py"],
            "text/html": [".html", ".css"],
        },
    });

    const formatTokens = (n: number) => n.toLocaleString();
    
    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getWordCount = (text: string) => {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };

    return (
        <div className="space-y-6">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span className="text-base">📁</span>
                        File Context
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* ── Dropzone ── */}
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 group
                            ${isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-border/40 hover:border-primary/40 hover:bg-muted/10"
                            }
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <UploadCloud
                                className={`w-8 h-8 transition-transform ${isDragActive ? "scale-110 text-primary" : "group-hover:text-primary/70"
                                    }`}
                            />
                            <p className="text-sm font-medium">
                                {isDragActive
                                    ? "Drop files now..."
                                    : "Drag & drop files here, or click to select"}
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                Supports .txt, .md, .csv, code files, and .pdf
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── File Analysis Section (Moved below) ── */}
            {files.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-px flex-1 bg-border/40" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            Context Analysis ({files.length} {files.length === 1 ? 'File' : 'Files'})
                        </span>
                        <div className="h-px flex-1 bg-border/40" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {files.map((file) => {
                            const charCount = file.text.length;
                            const wordCount = getWordCount(file.text);
                            
                            return (
                                <div
                                    key={file.id}
                                    className="group relative rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-4 transition-all hover:bg-card/50 hover:border-primary/20"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                                <FileText className="w-5 h-5 text-primary/70" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-semibold text-sm truncate text-foreground/90">
                                                    {file.name}
                                                </h4>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                    {formatSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeFile(file.id)}
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="sr-only">Remove</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Detailed Analysis Row */}
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        <div className="rounded-lg bg-background/40 p-2 border border-border/20 text-center sm:text-left">
                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter mb-1">Tokens</p>
                                            <p className="text-sm font-mono font-bold text-primary">
                                                {file.tokenCount === null ? "..." : formatTokens(file.tokenCount)}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-background/40 p-2 border border-border/20 text-center sm:text-left">
                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter mb-1">Words</p>
                                            <p className="text-sm font-mono font-bold text-foreground/80">
                                                {wordCount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-background/40 p-2 border border-border/20 text-center sm:text-left">
                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter mb-1">Chars</p>
                                            <p className="text-sm font-mono font-bold text-foreground/80">
                                                {charCount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {file.error && (
                                        <div className="mt-3 text-[10px] font-medium text-destructive bg-destructive/5 rounded-md p-2 border border-destructive/10">
                                            ⚠️ Error: {file.error}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
