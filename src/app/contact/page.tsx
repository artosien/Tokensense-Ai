import { Link } from "@/lib/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import ContactForm from "@/components/ContactForm";
import { Send, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Tokensense-Ai",
    description:
        "Get in touch with the Tokensense-Ai team. Have a question, feedback, or a feature request? We would love to hear from you.",
};

export const dynamic = 'force-static';

function ContactSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://www.tokensense-ai.com/contact/#webpage",
        "url": "https://www.tokensense-ai.com/contact",
        "name": "Contact Tokensense-Ai",
        "description": "Get in touch with the Tokensense-Ai team for feedback, bug reports, or feature requests.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.tokensense-ai.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Contact"
            }
          ]
        }
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

export default function ContactPage() {
    const tMobile = useTranslations("mobile");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ContactSchema />
            <SiteHeader />

            {/* Main Content */}
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        {tMobile("contact_us")}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have a question, feedback, or found a bug? Use the form below to reach the Tokensense-Ai team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-2xl bg-card/50 border border-border/40 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground m-0">Telegram Support</h3>        
                                <p className="text-sm text-muted-foreground mt-1">
                                    Message us directly on Telegram: {" "}
                                    <a 
                                        href="https://t.me/t0kensense" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                                    >
                                        @t0kensense
                                    </a>
                                </p> 
                            </div>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-card/50 border border-border/40 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground m-0">Community</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Visit our {" "}
                                    <a 
                                        href="https://github.com/artosien/Tokensense-Ai.git" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                                    >
                                        GitHub repository
                                    </a>
                                </p>       
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                            <h4 className="font-semibold text-indigo-400 mb-2">Enterprise Support</h4>
                            <p className="text-sm text-muted-foreground">
                                Looking for custom model integration or team plans? Contact our sales team for tailored solutions.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </main>

        </div>
    );
}