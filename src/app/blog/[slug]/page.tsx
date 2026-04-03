import { Metadata } from 'next';
import { Link } from "@/lib/i18n/navigation";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getBlogPostBySlug, getPublishedPosts, BlogPost } from "@/lib/blog-service";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Tokensense-Ai Blog`,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishDate,
      images: [{ url: post.image }],
    },
  };
}

async function BlogPostingSchema({ post }: { post: BlogPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://www.tokensense-ai.com${post.image}`,
    "datePublished": post.publishDate,
    "author": {
      "@type": "Organization",
      "name": "Tokensense-Ai Editorial",
      "url": "https://www.tokensense-ai.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tokensense-Ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tokensense-ai.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.tokensense-ai.com/blog/${post.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = 'en';
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogPostingSchema post={post} />
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Navigation & Metadata */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-indigo-400 gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to {tNav("blog")}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
              {post.category}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/40 py-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">TS</div>
                <span>By Tokensense Editorial</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-border/40 shadow-2xl relative bg-slate-900">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <article 
          className="prose prose-lg prose-invert prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share & Footer */}
        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Link href="/blog">
              <Button variant="link" className="text-indigo-400 p-0">
                Discover more articles →
              </Button>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
