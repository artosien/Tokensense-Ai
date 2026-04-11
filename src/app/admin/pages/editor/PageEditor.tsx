"use client";

import { useState } from "react";
import { PageContent } from "@/lib/page-service";
import { savePageAction } from "@/app/actions/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Layout, 
  FileText,
  Type,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface PageEditorProps {
  initialPage: PageContent;
}

export default function PageEditor({ initialPage }: PageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState<PageContent>(initialPage);
  const [isSaving, setIsSaving] = useState(false);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPage((prev) => ({ ...prev, [name]: value }));
  };

  const updateSection = (id: string, data: any) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...data } : s)
    }));
  };

  const addSection = () => {
    const newSection = {
      id: Math.random().toString(36).substring(2, 9),
      title: "New Section",
      content: "",
      type: 'text' as const
    };
    setPage(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (id: string) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePageAction(page);
      router.push("/admin/pages");
      router.refresh();
    } catch (error) {
      alert("Error saving page");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/admin/pages">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Pages
            </Button>
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Editing: <span className="text-emerald-400 capitalize">{page.slug}</span>
          </h1>
        </div>
        <Button disabled={isSaving} onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Metadata</h3>
              <p className="text-xs text-muted-foreground">SEO and header information.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input name="title" value={page.title} onChange={handlePageChange} />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea name="description" value={page.description} onChange={handlePageChange} rows={3} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Outline</h3>
            <div className="space-y-2">
              {page.sections.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300">
                  <span className="opacity-50">{i + 1}</span>
                  <span className="truncate flex-1">{s.title || "Untitled"}</span>
                  <Type className="w-3 h-3 opacity-30" />
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 mt-2 h-8 text-[10px] uppercase tracking-widest" onClick={addSection}>
                <Plus className="w-3 h-3" /> Add Section
              </Button>
            </div>
          </Card>
        </div>

        {/* Sections Editor */}
        <div className="lg:col-span-8 space-y-6">
          {page.sections.map((section, index) => (
            <Card key={section.id} className="p-6 border-border/40 bg-card/50 backdrop-blur-sm space-y-6 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Section {index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-400" onClick={() => removeSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="e.g., Why Tokenization Matters" />
                </div>
                <div className="space-y-2">
                  <Label>Content (HTML/Markdown)</Label>
                  <Textarea value={section.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} rows={10} className="font-mono text-sm" />
                </div>
              </div>

              {/* Mini Preview */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 prose prose-sm prose-invert max-w-none">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Preview</div>
                <div dangerouslySetInnerHTML={{ __html: section.content || "<p class='text-slate-600 italic'>No content...</p>" }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
