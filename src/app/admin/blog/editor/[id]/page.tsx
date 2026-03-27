import SiteHeader from "@/components/SiteHeader";
import PostEditor from "../PostEditor";
import { getBlogPosts } from "@/lib/blog-service";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit Post | Blog Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  const { id } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PostEditor post={post} />
      </main>
    </div>
  );
}
