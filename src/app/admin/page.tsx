import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BookOpen, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  ExternalLink,
  Users,
  BarChart3,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Published Posts", value: "27", icon: FileText, color: "text-blue-500" },
    { label: "Learning Modules", value: "4", icon: BookOpen, color: "text-indigo-500" },
    { label: "Total Students", value: "1,240", icon: Users, color: "text-emerald-500" },
    { label: "Monthly Views", value: "45.2k", icon: BarChart3, color: "text-amber-500" },
  ];

  const quickActions = [
    { 
      title: "Blog Management", 
      desc: "Create, edit, and schedule blog articles.", 
      href: "/admin/blog", 
      icon: FileText,
      actions: [
        { label: "New Post", href: "/admin/blog/editor/new", icon: Plus }
      ]
    },
    { 
      title: "Academy Lessons", 
      desc: "Manage courses, modules, and interactive lessons.", 
      href: "/admin/academy", 
      icon: BookOpen,
      actions: [
        { label: "New Module", href: "/admin/academy/new", icon: Plus }
      ]
    },
    { 
      title: "Media Library", 
      desc: "Upload and manage assets for your pages.", 
      href: "/admin/media", 
      icon: ImageIcon,
      actions: [
        { label: "Upload", href: "/admin/media/upload", icon: Plus }
      ]
    },
    { 
      title: "Page Editor", 
      desc: "Edit static pages like About, FAQ, and Privacy.", 
      href: "/admin/pages", 
      icon: Globe,
      actions: [
        { label: "All Pages", href: "/admin/pages", icon: Settings }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your content and platform settings.</p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4" /> View Site
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quickActions.map((action, i) => (
            <Card key={i} className="group border-border/40 bg-card/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white group-hover:text-indigo-400 transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={action.href}>Manage All</Link>
                </Button>
                {action.actions.map((sub, j) => (
                  <Button key={j} variant="ghost" size="sm" className="gap-2 text-muted-foreground" asChild>
                    <Link href={sub.href}>
                      <sub.icon className="w-3 h-3" /> {sub.label}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Recent Content Activity
          </h2>
          <Card className="border-border/40 bg-card/50">
            <div className="divide-y divide-border/40">
              {[
                { type: "Blog", title: "Why Output Tokens Are More Expensive...", user: "Admin", date: "2 mins ago" },
                { type: "Academy", title: "Added Lesson 1.5 to Module 1", user: "Admin", date: "1 hour ago" },
                { type: "Media", title: "Uploaded gpu-diagram.webp", user: "Admin", date: "3 hours ago" },
                { type: "Blog", title: "Published: The Deflation of Intelligence", user: "Admin", date: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.type}
                    </span>
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-4">
                    <span>by {item.user}</span>
                    <span className="w-24 text-right text-xs">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
