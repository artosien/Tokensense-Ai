import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-2">Tokensense</h3>
            <p className="text-gray-400 text-sm">
              Free LLM token cost calculator. Know your costs before every API call.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">Links</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">Legal</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center md:text-left">Support</h4>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-x-6 gap-y-2 md:gap-0 md:space-y-2">
              <li className="text-center md:text-left">
                <a
                  href="https://github.com/artosien"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  GitHub
                </a>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] mx-auto md:mx-0">
                  If you find the tool useful, please give it a star on GitHub.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Sponsor Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-gray-400 text-sm mb-3">
              Support Tokensense Development
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
            <p>&copy; {new Date().getFullYear()} Tokensense. All rights reserved.</p>
            <p className="mt-1">Built with Next.js • Open Source (Apache 2.0)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

