import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from 'next-intl/server';
import { Calculator, Zap, LineChart, FileText, Globe, Cpu } from "lucide-react";

export default async function BlogFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tTools = await getTranslations("tools");

  const quickTools = [
    { name: tTools("token_counter"), href: "/", icon: Calculator },
    { name: tTools("workflow_estimator"), href: "/workflow", icon: Zap },
    { name: tTools("comparison_table"), href: "/comparison", icon: LineChart },
    { name: tTools("context_caching"), href: "/caching", icon: Cpu },
    { name: tTools("video_planner"), href: "/video-planner", icon: FileText },
  ];

  return (
    <footer className="border-t border-border/40 bg-slate-950 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* SEO Optimized Brand Description */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-white font-black text-2xl tracking-tighter uppercase">
              Tokensense<span className="text-indigo-500">.Ai</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The industry standard for <strong>LLM token counting</strong> and <strong>AI cost estimation</strong>. 
              We provide developers with precise "pre-flight" metrics for OpenAI, Anthropic, and Google Gemini models.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/artosien/Tokensense-Ai.git" className="text-muted-foreground hover:text-white transition">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Core Calculators - Internal Linking for SEO */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Calculators</h4>
            <ul className="space-y-3">
              {quickTools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-muted-foreground hover:text-indigo-400 transition text-sm flex items-center gap-2">
                    <tool.icon className="w-4 h-4" />
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SEO Content Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  AI Economics Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing-history" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  Model Price History
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  Tokenization FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge Base */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Legal & Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  {t("terms_of_service")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-indigo-400 transition text-sm">
                  Contact Editorial
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Support & Badges */}
        <div className="border-t border-border/40 pt-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Support Development
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <iframe
                src="https://github.com/sponsors/artosien/button"
                title="Sponsor artosien"
                height="32"
                width="114"
                style={{ border: 0, borderRadius: "6px" }}
              />
              <a
                href="https://www.producthunt.com/products/tokensense-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tokensense-2"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  alt="Tokensense - See exactly what your LLM calls cost – instantly | Product Hunt"
                  width="148"
                  height="32"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1102621&theme=dark&t=1774570421882"
                />
              </a>
            </div>
          </div>

          <div className="max-w-md text-center md:text-right">
            <p className="text-[10px] text-muted-foreground/50 leading-loose">
                Tokensense-Ai provides real-time token count estimation for Large Language Models (LLMs) including 
                <strong> GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and Llama 3</strong>. All calculations are performed 100% client-side 
                for maximum privacy and security.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tokensense. {t("all_rights")}</p>
          <div className="flex items-center gap-6">
            <span>{t("built_with")}</span>
            <a href="https://github.com/artosien" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Open Source (Apache 2.0)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
