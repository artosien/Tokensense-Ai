"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-2">Tokensense</h3>
            <p className="text-gray-400 text-sm">
              {t("tagline")}
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">{t("learn") || "Learn"}</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li>
                <Link
                  href="/tokenomics"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  {tNav("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  {t("about") || "About"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">{t("legal")}</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  {t("terms_of_service")}
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  Robots Configuration
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">{t("support")}</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li className="text-center md:text-left">
                <a
                  href="https://github.com/artosien"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-plasma-400 transition text-sm"
                >
                  GitHub
                </a>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] mx-auto md:mx-0">
                  {t("github_note") || "If you find the tool useful, please give it a star on GitHub."}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Sponsor Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-gray-400 text-sm mb-3">
              {t("support_dev") || "Support Tokensense Development"}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
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

          {/* Copyright */}
          <div className="text-gray-500 text-sm text-center sm:text-right">
            <p>&copy; {new Date().getFullYear()} Tokensense. {t("all_rights")}</p>
            <p className="mt-1">{t("built_with")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
