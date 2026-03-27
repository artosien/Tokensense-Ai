"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/lib/blog-service";
import { savePostAction, uploadMediaAction, listExistingMediaAction } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Image as ImageIcon, Save, ArrowLeft, Eye, Edit3, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostEditorProps {
  post?: BlogPost;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    post || {
      title: "",
      slug: "",
      description: "",
      category: "Guides",
      status: "draft",
      publishDate: new Date().toISOString().split("T")[0],
      content: "",
      image: "",
      readTime: "5 min read",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
  );
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [media, setMedia] = useState<string[]>([]);

  useEffect(() => {
    listExistingMediaAction().then(setMedia);
  }, []);

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

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as any }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
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
      setFormData((prev) => ({ ...prev, image: url }));
      setMedia((prev) => Array.from(new Set([...prev, url])));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Side */}
      <div className={isPreview ? "hidden lg:block" : "block"}>
        <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link href="/admin/blog">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
            <div className="flex gap-2">
               <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden gap-2"
                onClick={() => setIsPreview(true)}
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
              <Button 
                disabled={isSaving}
                onClick={handleSave}
                size="sm"
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="The Future of Tokens"
                className="text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Market Trends">Market Trends</SelectItem>
                    <SelectItem value="Guides">Guides</SelectItem>
                    <SelectItem value="Prompt Engineering">Prompt Engineering</SelectItem>
                    <SelectItem value="LLM Economics">LLM Economics</SelectItem>
                    <SelectItem value="Model Comparisons">Model Comparisons</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="AI Research">AI Research</SelectItem>
                    <SelectItem value="Implementation">Implementation</SelectItem>
                    <SelectItem value="Case Studies">Case Studies</SelectItem>
                    <SelectItem value="Ethics & Safety">Ethics & Safety</SelectItem>
                    <SelectItem value="Product Updates">Product Updates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input 
                  id="publishDate" 
                  name="publishDate" 
                  type="date" 
                  value={formData.publishDate?.split("T")[0]} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Featured Image</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="xs" 
                  className="h-7 text-[10px] gap-1.5 bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20"
                  onClick={() => {
                    navigator.clipboard.writeText(`Create a high-quality, professional featured image for a blog post titled: "${formData.title}". Style: Modern tech, clean, 16:9 aspect ratio.`);
                    window.open("https://gemini.google.com/app", "_blank");
                  }}
                >
                  <ImageIcon className="w-3 h-3" /> Create Image (Gemini)
                </Button>
              </div>
              <div className="flex gap-2">
                <Input 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  placeholder="/images/blog/hero.png"
                />
                <div className="relative">
                  <Input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-10" 
                    onChange={handleImageUpload}
                  />
                  <Button variant="outline" size="icon" type="button">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {media.slice(-5).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: m }))}
                    className={`w-12 h-12 rounded border-2 overflow-hidden ${formData.image === m ? 'border-indigo-500' : 'border-transparent'}`}
                  >
                    <img src={m} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Article Content (HTML/JSX-like)</Label>
                <span className="text-[10px] text-muted-foreground">Supports Tailwind classes</span>
              </div>
              <Textarea 
                id="content" 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                rows={20}
                className="font-mono text-sm leading-relaxed"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Side */}
      <div className={!isPreview ? "hidden lg:block" : "block"}>
        <div className="lg:sticky lg:top-8 space-y-4">
          <div className="flex items-center justify-between lg:justify-end gap-4 mb-2">
             <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden gap-2"
                onClick={() => setIsPreview(false)}
              >
                <Edit3 className="w-4 h-4" /> Back to Editor
              </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" /> Live Preview
            </div>
          </div>

          <div className="bg-background border border-border/40 rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-120px)] overflow-y-auto">
            <div className="p-8 md:p-12 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                      {formData.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white leading-tight">
                    {formData.title || "Untiled Post"}
                  </h1>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-y border-border/40 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{new Date(formData.publishDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formData.readTime}</span>
                    </div>
                  </div>
               </div>

               {formData.image && (
                 <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border/40 bg-slate-900">
                   <img src={formData.image} alt="" className="w-full h-full object-cover" />
                 </div>
               )}

               <article 
                className="prose prose-invert prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-muted-foreground italic'>Start writing to see preview...</p>" }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
