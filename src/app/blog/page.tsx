import { Metadata } from 'next';
import { Link } from "@/lib/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog-service";
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Tokensense-Ai Blog | LLM Economics, Prompt Engineering & Cost Optimization",
  description: "Expert insights on reducing AI API costs, mastering prompt engineering, and staying ahead of LLM pricing trends. Learn how to optimize GPT-5, Claude, and Gemini usage.",
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: "Tokensense-Ai Blog | Intelligence on AI Costs",
    description: "Master the economics of LLMs. Strategies for cost-effective AI development.",
    url: 'https://www.tokensense-ai.com/blog',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tokensense-Ai | AI Cost & Prompt Engineering Blog",
    description: "Insights into the deflation of intelligence and AI cost optimization.",
    images: ['/og-image.png'],
  },
};

async function BlogSchema() {
  const posts = await getPublishedPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://www.tokensense-ai.com/blog/#blog",
        "url": "https://www.tokensense-ai.com/blog",
        "name": "Tokensense-Ai Blog",
        "description": "Expert insights on reducing AI API costs and mastering prompt engineering.",
        "publisher": {
          "@type": "Organization",
          "name": "Tokensense-Ai",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.tokensense-ai.com/logo.png"
          }
        },
        "blogPost": posts.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.date,
          "url": `https://www.tokensense-ai.com/blog/${post.slug}`
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPage() {
  const locale = 'en';
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogSchema />
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Clock className="w-3 h-3" />
            Latest Insights
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            Tokensense <span className="text-indigo-500">{tNav("blog")}</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Master the economics of AI. Expert strategies for prompt optimization, cost management, and staying ahead of the intelligence deflation curve.
          </p>
        </section>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="group border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold text-indigo-400 uppercase tracking-wider border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-indigo-400 transition-colors leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" className="p-0 text-indigo-400 hover:text-indigo-300 hover:bg-transparent group/btn" asChild>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                    Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stay Informed Section */}
        <section className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Stay Informed on AI Economics</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    We track every price cut, model update, and architectural breakthrough so you don't have to. Follow us on GitHub to see our open-source cost index.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8" asChild>
                        <a href="https://github.com/artosien/Tokensense-Ai.git" target="_blank" rel="noopener noreferrer">
                            Follow on GitHub
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/comparison">View Pricing Index</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
