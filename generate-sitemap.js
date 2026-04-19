const fs = require('fs');
const path = require('path');

const blogPosts = JSON.parse(fs.readFileSync('data/blog-posts.json', 'utf8'));
const glossaryData = JSON.parse(fs.readFileSync('data/glossary.json', 'utf8'));

const baseUrl = 'https://www.tokensense-ai.com';
const lastMod = '2026-05-20';

const urls = [
  { loc: '', priority: '1.0', changefreq: 'weekly' },
  { loc: '/workflow', priority: '0.9', changefreq: 'weekly' },
  { loc: '/pricing-history', priority: '0.9', changefreq: 'weekly' },
  { loc: '/comparison', priority: '0.9', changefreq: 'weekly' },
  { loc: '/multimodal', priority: '0.9', changefreq: 'weekly' },
  { loc: '/caching', priority: '0.9', changefreq: 'weekly' },
  { loc: '/video-planner', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
  { loc: '/glossary', priority: '0.9', changefreq: 'weekly' },
  { loc: '/tokenomics', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tokenomics/module-1', priority: '0.85', changefreq: 'monthly' },
  { loc: '/tokenomics/module-2', priority: '0.85', changefreq: 'monthly' },
  { loc: '/tokenomics/module-3', priority: '0.85', changefreq: 'monthly' },
  { loc: '/tokenomics/module-4', priority: '0.85', changefreq: 'monthly' },
  { loc: '/tools/batch', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/compression', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/context', priority: '0.8', changefreq: 'weekly' },
  { loc: '/about', priority: '0.7', changefreq: 'yearly' },
  { loc: '/about/angelo', priority: '0.6', changefreq: 'yearly' },
  { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'yearly' },
  { loc: '/changelog', priority: '0.7', changefreq: 'weekly' },
  { loc: '/account', priority: '0.5', changefreq: 'monthly' },
  { loc: '/login', priority: '0.5', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add core pages
urls.forEach(url => {
  xml += `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
});

// Add blog posts
blogPosts.forEach(post => {
  const postDate = post.publishDate ? post.publishDate.split('T')[0] : lastMod;
  xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`;
});

// Add glossary terms
glossaryData.forEach(term => {
  xml += `
  <url>
    <loc>${baseUrl}/glossary/${term.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

xml += `
</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml.trim());
console.log('public/sitemap.xml updated successfully with ' + (urls.length + blogPosts.length + glossaryData.length) + ' URLs.');
