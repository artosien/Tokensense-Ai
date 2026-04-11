import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { getPagesData } from "@/lib/page-service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Edit2, 
  Globe, 
  Eye,
  ArrowLeft,
  Calendar,
  Search
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default async function PagesAdmin() {
  const pages = await getPagesData();

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
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Page Management</h1>
            <p className="text-muted-foreground">Edit static pages like About, FAQ, and Privacy Policy.</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search pages..." 
            className="pl-10 bg-card/50 border-border/40"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {pages.map((page) => (
            <Card key={page.slug} className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group">
              <div className="p-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors capitalize">
                      {page.slug} Page
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">{page.title}</p>
                    <div className="flex items-center gap-4 pt-1 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Updated {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-[8px] bg-emerald-500/5 text-emerald-400 border-emerald-500/20">
                        Live
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href={`/${page.slug}`} target="_blank">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-500/20 text-emerald-400" asChild>
                    <Link href={`/admin/pages/editor/${page.slug}`}>
                      <Edit2 className="w-4 h-4" /> Edit Content
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
