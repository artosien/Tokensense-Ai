import { getBlogPosts } from "@/lib/blog-service";
import Link from "next/link";
import { Plus, Edit2, Trash2, Globe, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import { deletePostAction } from "@/app/actions/blog";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Blog Dashboard | Admin",
};

export default async function AdminBlogDashboard() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground mt-1">Local dashboard for managing blog posts</p>
          </div>
          <Link href="/admin/blog/editor/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Post
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Publish Date</th>
                <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    No blog posts found. Create your first post to get started!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        post.status === 'published' ? 'bg-green-500/10 text-green-400' :
                        post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {post.status === 'published' && <Globe className="w-3 h-3" />}
                        {post.status === 'scheduled' && <Clock className="w-3 h-3" />}
                        {post.status === 'draft' && <FileText className="w-3 h-3" />}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/editor/${post.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-indigo-400">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form action={async () => {
                          'use server';
                          await deletePostAction(post.id);
                        }}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
