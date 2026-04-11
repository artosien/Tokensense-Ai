"use client";

import React, { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { listExistingMediaAction, uploadMediaAction } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Search, 
  ArrowLeft, 
  Image as ImageIcon, 
  Check 
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function MediaLibrary() {
  const [media, setMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isUploading, setIsSaving] = useState(false);

  useEffect(() => {
    listExistingMediaAction().then(setMedia);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSaving(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const url = await uploadMediaAction(formData);
        setMedia(prev => [url, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredMedia = media.filter(m => 
    m.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Media Library</h1>
            <p className="text-muted-foreground">Manage and upload images for your blog and lessons.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input 
                type="file" 
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleUpload}
                disabled={isUploading}
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Upload Assets"}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search media..." 
            className="pl-10 bg-card/50 border-border/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredMedia.map((url, i) => (
            <Card key={i} className="group border-border/40 bg-card/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
              <div className="aspect-square relative bg-slate-900 flex items-center justify-center">
                <img 
                  src={url} 
                  alt="" 
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-indigo-400" onClick={() => copyToClipboard(url, i)}>
                    {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-indigo-400" asChild>
                    <a href={url} target="_blank"><ExternalLink className="w-4 h-4" /></a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[10px] text-muted-foreground truncate font-mono">{url.split('/').pop()}</p>
              </div>
            </Card>
          ))}
          
          {filteredMedia.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-dashed border-border/40">
                <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <p className="text-muted-foreground">No media found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
