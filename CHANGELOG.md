# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-08

### Added
- Author Bio: Created a dedicated biography page for Angelo S. Enriquez (`/about/angelo`) featuring a modern tech-stack visualizer and professional timeline.
- Navigation: Integrated "Web App Author" links in both primary and blog footers.
- Social: Added LinkedIn profile integration with custom branding on the author page.
- Project Showcase: New "Current Projects" section on author bio linking to AyoSPC, See&Do PH, and FontSniff.

### Changed
- Performance: **Massive Image Compression.** Converted all blog assets from PNG/JPG to WebP, achieving a **95% reduction** in payload size (e.g., 10MB images reduced to <150KB).
- Media: **Global Video Optimization.** Replaced heavy local MP4 files in Academy Modules 1-4 with optimized, lazy-loaded YouTube embeds to improve PageSpeed scores and decrease initial load times.
- Homepage Architecture: Relocated the "Optimization Journey" quickstart banner to the bottom of the page to prioritize the core calculator tool.
- Homepage Hero: Replaced the static UI graphic with an autoplaying, muted promo video for higher engagement.
- Internal Linking: Updated all Lesson and Academy CTAs to point directly to the `/tokenomics` foundation page.

### Removed
- Redundant Content: Deleted `/token-learning` and `/token-learning/how-tokenizers-work` routes to consolidate educational content under the primary `/tokenomics` Academy structure.
- Legacy Assets: Cleaned up unused local video files and large PNG assets from the `public/` directory.

## [1.6.0] - 2026-04-01

### Added
- Metadata: Global `metadataBase` to resolve absolute URL generation issues (e.g., `localhost:3000` errors in social tags).
- AI Crawling: Added `llms.txt` alternate links and a custom `llms-content` tag to the root metadata.
- Infrastructure: Created `src/i18n/request.ts` and `src/lib/i18n/navigation.ts` to support `next-intl` in a flattened routing environment.

### Changed
- i18n Architecture: **Flattened Routing.** Removed dynamic `[lang]` segments from the file system, moving all pages to the root level for a simpler URL structure.
- SEO Architecture: Refactored the homepage (`src/app/page.tsx`) to use React Server Components (RSC) for the Hero, Features, About, and FAQ sections. This ensures content is pre-rendered for search bots and improves indexing performance.
- Localization: Hardcoded the application to a single English (`en`) locale to focus on core growth, while maintaining the underlying i18n infrastructure for future expansion.
- Next.js Config: Integrated `createNextIntlPlugin` and added `serverExternalPackages` for `@ffprobe-installer/ffprobe` and `fluent-ffmpeg` to ensure Turbopack compatibility.

### Fixed
- Authentication: Resolved `CLIENT_FETCH_ERROR` by excluding the entire `/api/` path from global redirects in `next.config.ts`.
- NextAuth: Refined the `NextAuth` handler and `AuthProvider` configuration for better stability in Next.js 16/Turbopack environments.
- Blog: Updated blog routes and metadata generation to handle the removal of the dynamic `locale` parameter.

### Removed
- Language Switcher: Excised the `LanguageSwitcher` component and all multi-language UI elements from the `SiteHeader`.
- Dynamic Routing: Deleted all `[lang]` directory structures in favor of static, root-level pages.

## [1.5.0] - 2026-03-27

### Added
- Local Blog Admin Dashboard (/admin/blog) for local content management.
- Blog features: Live side-by-side preview, draft/scheduling system, and media management.
- AI Integration: "Create Image (Gemini)" tool in blog editor with automatic prompt generation.
- Prompt Editor: "Sample Use Cases" (Light, Medium, Heavy) for quick benchmarking.
- Content Toolbar: Rich text formatting tools for blog article creation.

### Changed
- Major UI Redesign: New Hero section with primary/secondary CTAs and dashboard visual preview.
- Navigation Overhaul: Refactored header with a unified "Tools" dropdown.
- Tool Discoverability: Moved "Pricing History" into the core Tools menu.
- Feature Showcase: Updated interactive cards with prominent "Launch Tool" actions.
- Support Badges: Resized Product Hunt badge to align perfectly with GitHub Sponsors button.
- Hierarchy: Renamed and reorganized FAQ sections for better user flow.

### Removed
- Relocated Bug Report form from the main homepage flow to dedicated feedback areas.

## [0.2.0] - 2026-03-23

### Added
- Reddit social share icon with brand color (#FF4500) to the social share bars.
- GitHub repository icon and link to the social share bars.
- GitHub repository link to the site navigation bar for easier access to source code.

### Changed
- Redesigned the About page "Development Build Log" section into a scrollable terminal-style text area for better readability and space efficiency.
- Updated header social share icons to prioritize developer-centric platforms (Reddit, GitHub).

### Removed
- Facebook social share icons and associated links.
- "Join Community" Discord badge and invitation links from the Contact page.

## [0.1.0] - 2026-03-16

### Added
- Initial production-ready release of TokenSense-Ai.
- Real-time token calculation engine with `tiktoken` WASM integration.
- Model selection interface with quick-access pills for top models (GPT-4o, Claude 3.5 Sonnet, etc.).
- Context caching break-even calculator for Anthropic and Google Gemini models.
- Multi-modal image token estimator using OpenAI/Anthropic vision pricing logic.
- Agentic loop simulator for compounding multi-turn conversation costs.
- Session persistence to save prompts and selections across browser refreshes.
- Responsive dashboard with live cost metrics and information tooltips.
- Privacy-first architecture: 100% client-side processing with no server-side data storage.
