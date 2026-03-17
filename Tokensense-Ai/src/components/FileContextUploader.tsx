"use client";

import React, { useCallback, useState } from "react";
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
    const updateGlobalStore = useCallback((currentFiles: AttachedFile[]) => {
        const totalTokens = currentFiles.reduce(
            (sum, f) => sum + (f.tokenCount || 0),
            0
        );
        const combinedText = currentFiles
            .map((f) => `--- FILE: ${f.name} ---\n${f.text}\n`)
            .join("\n");

        setFileTokenCount(totalTokens);
        setFileText(combinedText);
    }, [setFileTokenCount, setFileText]);

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
            const newFiles = prev.map((f) =>
                f.id === id ? { ...f, ...updates } : f
            );
            // After any file update, sync with the global store
            updateGlobalStore(newFiles);
            return newFiles;
        });
    }, [updateGlobalStore]);

    // Remove a file from the list
    const removeFile = (id: string) => {
        setFiles((prev) => {
            const newFiles = prev.filter((f) => f.id !== id);
            updateGlobalStore(newFiles);
            return newFiles;
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
                    const tokens = countTokens(text);
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

    return (
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

                {/* ── File List ── */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between rounded-md border border-border/40 bg-background/50 px-3 py-2 text-sm"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                                    <span className="truncate font-medium text-foreground/80">
                                        {file.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {file.error ? (
                                        <span className="text-xs text-destructive">
                                            {file.error}
                                        </span>
                                    ) : file.tokenCount === null ? (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Parsing...</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-mono font-medium text-primary">
                                            {formatTokens(file.tokenCount)} tokens
                                        </span>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeFile(file.id)}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        <span className="sr-only">Remove file</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
