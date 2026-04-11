"use client";

import { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/lib/blog-service";
import { savePostAction, uploadMediaAction, listExistingMediaAction } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, Clock, Image as ImageIcon, Save, ArrowLeft, Eye, Edit3, Upload, 
  Bold, Italic, Link as LinkIcon, List, ListOrdered, Code, Heading1, Heading2, 
  Heading3, Quote, Table, Video, Minus, Type, Info, AlertTriangle, CheckCircle2,
  Strikethrough, Maximize, Minimize, MousePointer2, Settings, Tag, User, Search,
  Globe, Shield, Trash2, History, Languages, FileText, ChevronRight, MoreVertical,
  Undo, Redo, Underline
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PostEditorProps {
  post?: BlogPost;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Stats
  const [stats, setStats] = useState({ words: 0, chars: 0, readTime: "1 min read" });

  const [formData, setFormData] = useState<Partial<BlogPost>>(
    post || {
      title: "",
      slug: "",
      description: "",
      category: "Guides",
      status: "draft",
      visibility: "public",
      publishDate: new Date().toISOString().split("T")[0],
      content: "",
      image: "",
      imageAlt: "",
      tags: [],
      author: "Angelo Enriquez",
      focusKeyword: "",
      readTime: "1 min read",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
  );
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    listExistingMediaAction().then(setMedia);
  }, []);

  // Update Stats Effect
  useEffect(() => {
    const text = formData.content || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readTimeNum = Math.ceil(words / 225);
    const readTime = `${readTimeNum} min read`;
    
    setStats({ words, chars, readTime });
    setFormData(prev => ({ ...prev, readTime, wordCount: words, charCount: chars }));
  }, [formData.content]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        insertAtCursor("<strong>", "</strong>");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        insertAtCursor("<em>", "</em>");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "title" && !post) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePostAction(formData);
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Error saving post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      const url = await uploadMediaAction(data);
      setMedia((prev) => Array.from(new Set([...prev, url])));
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const insertAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content || "";
    const selectedText = currentContent.substring(start, end);
    
    const newContent = 
      currentContent.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      currentContent.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + (selectedText ? selectedText.length + after.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarActions = [
    { icon: Bold, label: "Bold (Ctrl+B)", action: () => insertAtCursor("<strong>", "</strong>") },
    { icon: Italic, label: "Italic (Ctrl+I)", action: () => insertAtCursor("<em>", "</em>") },
    { icon: Underline, label: "Underline", action: () => insertAtCursor("<u>", "</u>") },
    { icon: Strikethrough, label: "Strike", action: () => insertAtCursor("<del>", "</del>") },
    { icon: LinkIcon, label: "Link (Ctrl+K)", action: () => {
      const url = prompt("Enter URL:", "https://");
      if (url) insertAtCursor(`<a href="${url}" className="text-indigo-400 hover:underline">`, "</a>");
    }},
    { icon: Heading1, label: "H1", action: () => insertAtCursor("<h2 className='text-3xl font-black mt-12 mb-6'>", "</h2>") },
    { icon: Heading2, label: "H2", action: () => insertAtCursor("<h3 className='text-2xl font-bold mt-10 mb-4'>", "</h3>") },
    { icon: Heading3, label: "H3", action: () => insertAtCursor("<h4 className='text-xl font-bold mt-8 mb-4'>", "</h4>") },
    { icon: Quote, label: "Quote", action: () => insertAtCursor("<blockquote className='border-l-4 border-indigo-500 pl-6 my-8 italic text-lg text-muted-foreground'>", "</blockquote>") },
    { icon: List, label: "Unordered List", action: () => insertAtCursor("<ul className='list-disc pl-6 space-y-3 my-6'>\n  <li>", "</li>\n</ul>") },
    { icon: ListOrdered, label: "Ordered List", action: () => insertAtCursor("<ol className='list-decimal pl-6 space-y-3 my-6'>\n  <li>", "</li>\n</ol>") },
    { icon: Code, label: "Code Block", action: () => insertAtCursor("<pre className='bg-slate-950 p-6 rounded-2xl border border-white/5 my-8 overflow-x-auto'><code className='text-indigo-300 font-mono text-sm'>", "</code></pre>") },
    { icon: Table, label: "Table", action: () => insertAtCursor(
      "<div className='overflow-x-auto my-8'>\n  <table className='w-full border-collapse border border-border/40'>\n    <thead>\n      <tr className='bg-muted/30'>\n        <th className='border border-border/40 p-3 text-left font-bold'>Header 1</th>\n        <th className='border border-border/40 p-3 text-left font-bold'>Header 2</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td className='border border-border/40 p-3'>Cell 1</td>\n        <td className='border border-border/40 p-3'>Cell 2</td>\n      </tr>\n    </tbody>\n  </table>\n</div>"
    )},
    { icon: Video, label: "Video", action: () => {
      const url = prompt("Enter Video URL (MP4 or YouTube Embed):", "");
      if (url) {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          const embedUrl = url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
          insertAtCursor(`<div className='aspect-video w-full rounded-2xl overflow-hidden my-10 border border-border/40'>\n  <iframe src="${embedUrl}" className='w-full h-full' allowFullScreen />\n</div>`);
        } else {
          insertAtCursor(`<video src="${url}" controls className='w-full rounded-2xl my-10 border border-border/40' />`);
        }
      }
    }},
    { icon: Minus, label: "Divider", action: () => insertAtCursor("<hr className='my-12 border-border/40' />") },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", isFullScreen ? "fixed inset-0 z-[100]" : "")}>
      {/* Top Header */}
      <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-indigo-400">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border/40 hidden sm:block" />
          <h1 className="text-sm font-black tracking-widest uppercase hidden md:block">Blog Post Editor</h1>
          {isSaving && <div className="text-[10px] text-indigo-400 animate-pulse font-mono">Autosaving...</div>}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 hidden sm:flex"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save Draft</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            onClick={() => {
              setFormData(prev => ({ ...prev, status: 'published', publishDate: new Date().toISOString() }));
              handleSave();
            }}
            disabled={isSaving}
          >
            Publish
          </Button>
          <div className="h-6 w-px bg-border/40 mx-2" />
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor/Preview */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/20">
          <div className={cn("max-w-4xl mx-auto px-6 py-12 space-y-8", isFullScreen ? "max-w-5xl" : "")}>
            
            {!isPreview ? (
              <>
                <div className="space-y-4">
                  <Input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Enter post title..." 
                    className="text-4xl md:text-5xl font-black bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-30 h-auto leading-tight"
                  />
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span className="text-indigo-400">URL Slug:</span>
                    <Input 
                      name="slug" 
                      value={formData.slug} 
                      onChange={handleChange} 
                      className="h-6 bg-indigo-500/5 border-none focus-visible:ring-0 w-auto min-w-[300px]"
                    />
                  </div>
                </div>

                {/* Toolbar */}
                <Card className="sticky top-0 z-40 p-2 border-border/40 bg-card/80 backdrop-blur-xl shadow-xl flex flex-row items-center gap-1 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo"><Undo className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Redo"><Redo className="w-4 h-4" /></Button>
                  </div>
                  <div className="h-6 w-px bg-border/40 mx-1 flex-shrink-0" />
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {toolbarActions.map((tool, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-indigo-400 hover:bg-indigo-500/10"
                        onClick={tool.action}
                        title={tool.label}
                      >
                        <tool.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                  <div className="h-6 w-px bg-border/40 mx-1 flex-shrink-0" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1.5 text-xs font-bold flex-shrink-0"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Media
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    title="Focus Mode"
                  >
                    {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </Card>

                {showMediaPicker && (
                  <Card className="p-4 border-indigo-500/20 bg-indigo-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest">Media Library</h3>
                      <Label className="flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input type="file" className="hidden" onChange={async (e) => {
                          const url = await handleImageUpload(e);
                          if (url) insertAtCursor(`<div className='aspect-video w-full rounded-2xl overflow-hidden my-10 border border-border/40'><img src="${url}" alt="Blog Image" className='w-full h-full object-cover' /></div>`);
                        }} />
                      </Label>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {media.map((m, i) => (
                        <button
                          key={i}
                          onClick={() => insertAtCursor(`<div className='aspect-video w-full rounded-2xl overflow-hidden my-10 border border-border/40'><img src="${m}" alt="Blog Image" className='w-full h-full object-cover' /></div>`)}
                          className="aspect-square rounded-lg overflow-hidden border border-border/40 hover:border-indigo-500 transition-all group"
                        >
                          <img src={m} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

                <Textarea 
                  ref={textareaRef}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start your story..."
                  className="min-h-[600px] text-lg leading-relaxed bg-transparent border-none focus-visible:ring-0 p-0 placeholder:opacity-20 font-serif"
                />

                {/* Stats Bar */}
                <div className="flex items-center gap-6 py-4 border-t border-border/40 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <span>{stats.words} Words</span>
                  <span>{stats.chars} Characters</span>
                  <span>{stats.readTime}</span>
                </div>
              </>
            ) : (
              <div className="prose prose-invert prose-indigo max-w-none animate-in fade-in duration-500">
                <header className="mb-12 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                      {formData.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{formData.readTime}</span>
                  </div>
                  <h1 className="text-5xl font-black text-white leading-tight">{formData.title || "Untitled Post"}</h1>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pb-8 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(formData.publishDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{formData.author}</span>
                    </div>
                  </div>
                </header>
                {formData.image && (
                  <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/5">
                    <img src={formData.image} alt={formData.imageAlt || ""} className="w-full h-full object-cover" />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: formData.content || "" }} />
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Settings */}
        <aside className={cn(
          "w-[350px] border-l border-border/40 bg-card/30 flex flex-col overflow-hidden transition-all",
          isFullScreen ? "w-0 opacity-0" : ""
        )}>
          <Tabs defaultValue="settings" className="flex flex-col h-full">
            <div className="p-4 border-b border-border/40">
              <TabsList className="w-full bg-muted/30">
                <TabsTrigger value="settings" className="flex-1 gap-2 text-xs"><Settings className="w-3.5 h-3.5" /> General</TabsTrigger>
                <TabsTrigger value="seo" className="flex-1 gap-2 text-xs"><Search className="w-3.5 h-3.5" /> SEO</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <TabsContent value="settings" className="mt-0 space-y-8">
                {/* Publish Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                    <Globe className="w-3.5 h-3.5" /> Publish Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                      <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v as any }))}>
                        <SelectTrigger className="h-9 bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Visibility</Label>
                      <Select value={formData.visibility} onValueChange={(v) => setFormData(p => ({ ...p, visibility: v as any }))}>
                        <SelectTrigger className="h-9 bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Publish Date</Label>
                      <Input 
                        type="date" 
                        value={formData.publishDate?.split("T")[0]} 
                        onChange={(e) => setFormData(p => ({ ...p, publishDate: e.target.value }))}
                        className="h-9 bg-background/50 border-border/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                    <Tag className="w-3.5 h-3.5" /> Organization
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Main Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                        <SelectTrigger className="h-9 bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Market Trends">Market Trends</SelectItem>
                          <SelectItem value="Guides">Guides</SelectItem>
                          <SelectItem value="Prompt Engineering">Prompt Engineering</SelectItem>
                          <SelectItem value="LLM Economics">LLM Economics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add tag..."
                          className="h-8 text-xs bg-background/50 border-border/40"
                        />
                        <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleAddTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.tags?.map((tag, i) => (
                          <div key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                            {tag}
                            <button onClick={() => setFormData(p => ({ ...p, tags: p.tags?.filter(t => t !== tag) }))}>
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author Section */}
                <div className="space-y-4">
                   <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                    <User className="w-3.5 h-3.5" /> Author
                  </h3>
                  <Select value={formData.author} onValueChange={(v) => setFormData(p => ({ ...p, author: v }))}>
                    <SelectTrigger className="h-9 bg-background/50 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Angelo Enriquez">Angelo Enriquez</SelectItem>
                      <SelectItem value="Artosien">Artosien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Image Section */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-[10px] uppercase font-bold text-muted-foreground">Featured Image</h3>
                  {formData.image && (
                    <div className="aspect-video rounded-xl overflow-hidden border border-border/40 relative group">
                      <img src={formData.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="ghost" size="sm" className="text-white hover:text-red-400" onClick={() => setFormData(p => ({ ...p, image: "" }))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Image URL..." 
                      value={formData.image} 
                      onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                      className="h-8 text-[10px] bg-background/50 border-border/40"
                    />
                    <Label className="flex items-center justify-center h-8 w-8 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                       <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                       <input type="file" className="hidden" onChange={async (e) => {
                         const url = await handleImageUpload(e);
                         if (url) setFormData(p => ({ ...p, image: url }));
                       }} />
                    </Label>
                  </div>
                  <Input 
                    placeholder="Image Alt Text..." 
                    value={formData.imageAlt} 
                    onChange={(e) => setFormData(p => ({ ...p, imageAlt: e.target.value }))}
                    className="h-8 text-[10px] bg-background/50 border-border/40"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="mt-0 space-y-8">
                 <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                    <Search className="w-3.5 h-3.5" /> SEO Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Focus Keyword</Label>
                      <Input 
                        value={formData.focusKeyword} 
                        onChange={(e) => setFormData(p => ({ ...p, focusKeyword: e.target.value }))}
                        placeholder="e.g. AI tokenomics"
                        className="h-9 bg-background/50 border-border/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Meta Description</Label>
                        <span className={cn(
                          "text-[9px] font-bold",
                          (formData.description?.length || 0) > 160 ? "text-red-400" : "text-muted-foreground"
                        )}>
                          {formData.description?.length || 0}/160
                        </span>
                      </div>
                      <Textarea 
                        name="description"
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="Summary for search results..."
                        className="h-32 text-xs bg-background/50 border-border/40 resize-none"
                      />
                      <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                        Keep it between 150-160 characters for best results in Google.
                      </p>
                    </div>

                    {/* Google Preview Simulation */}
                    <div className="pt-6 border-t border-border/40 space-y-3">
                      <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Search Preview</h4>
                      <Card className="p-4 bg-white space-y-1.5 border-none shadow-none rounded-lg overflow-hidden">
                        <div className="text-[10px] text-[#202124] flex items-center gap-1.5 truncate">
                          <span>tokensense-ai.com</span>
                          <span className="text-[#5f6368]">› blog › {formData.slug}</span>
                        </div>
                        <div className="text-lg text-[#1a0dab] font-medium leading-tight truncate">
                          {formData.title || "Your Blog Post Title"}
                        </div>
                        <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                          <span className="font-bold">{new Date(formData.publishDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                          {formData.description || "The meta description will appear here. It should be a concise summary of your article that encourages users to click through to your site."}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
