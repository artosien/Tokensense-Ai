import SiteHeader from "@/components/SiteHeader";
import PostEditor from "../PostEditor";
import { redirect } from "next/navigation";

export const metadata = {
  title: "New Post | Blog Admin",
};

export default function NewPostPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PostEditor />
      </main>
    </div>
  );
}
