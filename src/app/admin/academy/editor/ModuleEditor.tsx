"use client";

import { useState } from "react";
import { Module, Lesson } from "@/lib/academy-service";
import { saveModuleAction } from "@/app/actions/academy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Layout, 
  Video, 
  MousePointer2, 
  FileText,
  Settings,
  GripVertical
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ModuleEditorProps {
  initialModule?: Module;
}

export default function ModuleEditor({ initialModule }: ModuleEditorProps) {
  const router = useRouter();
  const [module, setModule] = useState<Partial<Module>>(
    initialModule || {
      title: "",
      slug: "",
      description: "",
      level: "Beginner",
      category: "Foundation",
      status: "draft",
      lessons: []
    }
  );

  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModule((prev) => ({ ...prev, [name]: value }));
    
    if (name === "title" && !initialModule) {
      const slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setModule((prev) => ({ ...prev, slug }));
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substring(2, 9),
      title: "New Lesson",
      slug: "new-lesson",
      description: "",
      type: "content",
      content: "",
      status: "draft",
      order: (module.lessons?.length || 0) + 1
    };
    setModule(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setActiveLessonIndex((module.lessons?.length || 0));
  };

  const updateLesson = (index: number, data: Partial<Lesson>) => {
    const newLessons = [...(module.lessons || [])];
    newLessons[index] = { ...newLessons[index], ...data };
    setModule(prev => ({ ...prev, lessons: newLessons }));
  };

  const removeLesson = (index: number) => {
    const newLessons = (module.lessons || []).filter((_, i) => i !== index);
    setModule(prev => ({ ...prev, lessons: newLessons }));
    if (activeLessonIndex === index) setActiveLessonIndex(null);
  };

  const moveLesson = (index: number, direction: 'up' | 'down') => {
    const newLessons = [...(module.lessons || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLessons.length) return;
    
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
    setModule(prev => ({ ...prev, lessons: newLessons }));
    if (activeLessonIndex === index) setActiveLessonIndex(targetIndex);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveModuleAction(module);
      router.push("/admin/academy");
      router.refresh();
    } catch (error) {
      console.error("Failed to save module:", error);
      alert("Error saving module");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Lessons List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/academy">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Academy
            </Button>
          </Link>
          <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Save className="w-4 h-4" /> Save Module
          </Button>
        </div>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-indigo-500/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Module Structure</h3>
          </div>
          <div className="p-2 space-y-1">
            <button
              onClick={() => setActiveLessonIndex(null)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-3 ${activeLessonIndex === null ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Settings className="w-4 h-4" /> Module Settings
            </button>
            <div className="h-px bg-border/20 my-2" />
            {module.lessons?.map((lesson, i) => (
              <div key={lesson.id} className="group relative">
                <button
                  onClick={() => setActiveLessonIndex(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${activeLessonIndex === i ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}
                >
                  <span className="text-[10px] font-black opacity-50 w-4">{i + 1}</span>
                  <span className="truncate flex-1">{lesson.title}</span>
                  {lesson.type === 'interactive' && <MousePointer2 className="w-3 h-3 text-amber-500" />}
                  {lesson.type === 'video' && <Video className="w-3 h-3 text-blue-500" />}
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveLesson(i, 'up'); }}>
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveLesson(i, 'down'); }}>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5 mt-2" onClick={addLesson}>
              <Plus className="w-4 h-4" /> Add Lesson
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Editor Area */}
      <div className="lg:col-span-8">
        {activeLessonIndex === null ? (
          /* Module Settings Editor */
          <Card className="p-8 border-border/40 bg-card/50 backdrop-blur-sm space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Module Settings</h2>
              <p className="text-sm text-muted-foreground">General information about this learning module.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Module Title</Label>
                <Input id="title" name="title" value={module.title} onChange={handleModuleChange} placeholder="e.g., The Atomic Unit of AI" className="text-lg font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" value={module.slug} onChange={handleModuleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={module.category} onChange={handleModuleChange} placeholder="e.g., Foundation" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={module.level} onValueChange={(v) => setModule(prev => ({ ...prev, level: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={module.status} onValueChange={(v) => setModule(prev => ({ ...prev, status: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Module Description</Label>
                <Textarea id="description" name="description" value={module.description} onChange={handleModuleChange} rows={3} />
              </div>
            </div>
          </Card>
        ) : (
          /* Lesson Editor */
          <Card className="p-8 border-border/40 bg-card/50 backdrop-blur-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Lesson {activeLessonIndex + 1}</Badge>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate max-w-md">
                    {module.lessons![activeLessonIndex].title}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">Configure lesson content and interactivity.</p>
              </div>
              <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 gap-2" onClick={() => removeLesson(activeLessonIndex)}>
                <Trash2 className="w-4 h-4" /> Delete Lesson
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Lesson Title</Label>
                <Input 
                  value={module.lessons![activeLessonIndex].title} 
                  onChange={(e) => updateLesson(activeLessonIndex, { title: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lesson Type</Label>
                  <Select value={module.lessons![activeLessonIndex].type} onValueChange={(v) => updateLesson(activeLessonIndex, { type: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content">
                        <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Standard Content</div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2"><Video className="w-3 h-3" /> Video Lesson</div>
                      </SelectItem>
                      <SelectItem value="interactive">
                        <div className="flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> Interactive Tool</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={module.lessons![activeLessonIndex].status} onValueChange={(v) => updateLesson(activeLessonIndex, { status: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {module.lessons![activeLessonIndex].type === 'video' && (
                <div className="space-y-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <Label>YouTube Video ID or URL</Label>
                  <Input 
                    value={module.lessons![activeLessonIndex].videoUrl || ""} 
                    onChange={(e) => updateLesson(activeLessonIndex, { videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              {module.lessons![activeLessonIndex].type === 'interactive' && (
                <div className="space-y-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <Label>Interactive Component Identifier</Label>
                  <Select 
                    value={module.lessons![activeLessonIndex].interactiveComponent || ""} 
                    onValueChange={(v) => updateLesson(activeLessonIndex, { interactiveComponent: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TokenizerPlayground">Tokenizer Playground</SelectItem>
                      <SelectItem value="BatchCostPlanner">Batch Cost Planner</SelectItem>
                      <SelectItem value="ModelComparisonSlider">Model Comparison Slider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Lesson Content (HTML/Markdown)</Label>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Live Preview Enabled</span>
                </div>
                <Textarea 
                  value={module.lessons![activeLessonIndex].content} 
                  onChange={(e) => updateLesson(activeLessonIndex, { content: e.target.value })} 
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              
              {/* Preview Bubble */}
              <div className="mt-4 p-6 rounded-2xl bg-slate-900 border border-white/5 prose prose-invert max-w-none shadow-inner">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Content Preview
                </div>
                <div dangerouslySetInnerHTML={{ __html: module.lessons![activeLessonIndex].content || "<p class='text-slate-500 italic'>No content yet...</p>" }} />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
