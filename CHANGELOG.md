# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
