import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { getAcademyData } from "@/lib/academy-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Layers, 
  Eye,
  ArrowLeft,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AcademyAdmin() {
  const modules = await getAcademyData();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Academy Management</h1>
            <p className="text-muted-foreground">Manage your learning modules and interactive lessons.</p>
          </div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/admin/academy/new">
              <Plus className="w-4 h-4" /> New Module
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group">
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {module.title}
                      </h2>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-indigo-500/20 bg-indigo-500/5 text-indigo-400">
                        {module.level}
                      </Badge>
                      {module.status === 'draft' && (
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-widest bg-slate-800 text-slate-400">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl line-clamp-1">{module.description}</p>
                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        {module.lessons.length} Lessons
                      </span>
                      <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                        {module.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href={`/tokenomics/${module.slug}`} target="_blank">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-indigo-500/20 text-indigo-400" asChild>
                    <Link href={`/admin/academy/editor/${module.id}`}>
                      <Edit2 className="w-4 h-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-rose-500 hover:text-rose-400 border-rose-500/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Lessons Preview */}
              <div className="px-6 pb-6 pt-2">
                <div className="border-t border-border/20 pt-4 space-y-2">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Module Roadmap</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.lessons.map((lesson, i) => (
                      <div key={lesson.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/5 text-xs text-slate-300">
                        <span className="text-[10px] font-black text-indigo-500">{i + 1}</span>
                        {lesson.title}
                        {lesson.type === 'interactive' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Interactive" />}
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase tracking-widest gap-1 text-muted-foreground hover:text-indigo-400">
                      <Plus className="w-3 h-3" /> Add Lesson
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
