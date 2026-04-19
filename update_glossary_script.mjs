import fs from 'fs';
import path from 'path';

const GLOSSARY_DIR = './public/Glossary add';
const JSON_FILE = './data/glossary.json';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function toTitleCase(str) {
  return str.split(' ').map(word => {
    if (word.length <= 3 && /^[A-Z]+$/.test(word)) return word; // Keep acronyms like LLM
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function parseGlossaryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Normalize line endings
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const sections = normalizedContent.split(/--------------------------------------------------------------------------------/);
  const terms = [];

  for (let i = 1; i < sections.length; i += 2) {
    const termName = sections[i].trim();
    const termContent = sections[i + 1]?.trim();

    if (termName && termContent) {
      const paragraphs = termContent.split(/\n\s*\n/);
      const firstPara = paragraphs[0].replace(/\s+/g, ' ').trim();
      
      // TL;DR: First sentence or first two if short
      const sentences = firstPara.split(/(?<=[.!?])\s+/);
      let tldr = sentences[0];
      if (sentences.length > 1 && tldr.length < 100) {
        tldr += ' ' + sentences[1];
      }

      // Deep dive: full content with formatting
      let deepDive = paragraphs.map(p => {
        const text = p.replace(/\s+/g, ' ').trim();
        
        // Check for headings (e.g., "Key concepts in agent design include:")
        if (text.endsWith(':') && text.length < 100) {
             return `<h3 class="text-xl font-bold text-white mt-8 mb-4">${text}</h3>`;
        }
        
        // Check for numbered lists
        if (text.match(/^\d\.\s/)) {
            const items = text.split(/(?=\d\.\s)/).map(item => `<li>${item.replace(/^\d\.\s/, '').trim()}</li>`).join('');
            return `<ol class="list-decimal pl-6 space-y-4 my-6 text-slate-400 font-medium">${items}</ol>`;
        }

        // Check for bulleted lists
        if (text.match(/^[\u2022\*\-]\s/)) {
            const items = text.split(/(?=[\u2022\*\-]\s)/).map(item => `<li>${item.replace(/^[\u2022\*\-]\s/, '').trim()}</li>`).join('');
            return `<ul class="list-disc pl-6 space-y-2 my-6 text-slate-400 font-medium">${items}</ul>`;
        }

        return `<p>${text}</p>`;
      }).join('\n\n');

      terms.push({
        id: slugify(termName),
        term: toTitleCase(termName),
        definition: firstPara,
        tldr,
        deepDive,
      });
    }
  }
  return terms;
}

const allNewTerms = [];
for (let i = 1; i <= 4; i++) {
  const filePath = path.join(GLOSSARY_DIR, `LLM_Glossary_Part${i}.txt`);
  if (fs.existsSync(filePath)) {
    console.log(`Reading ${filePath}...`);
    allNewTerms.push(...parseGlossaryFile(filePath));
  }
}

const existingGlossary = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));

console.log(`Parsed ${allNewTerms.length} terms from text files.`);

const updatedGlossary = [...existingGlossary];

let updatedCount = 0;
let addedCount = 0;

allNewTerms.forEach(newTerm => {
  const index = updatedGlossary.findIndex(t => t.id === newTerm.id || t.term.toLowerCase() === newTerm.term.toLowerCase());
  
  if (index !== -1) {
    // Update existing
    updatedGlossary[index] = {
      ...updatedGlossary[index],
      definition: newTerm.definition,
      tldr: newTerm.tldr,
      deepDive: newTerm.deepDive,
    };
    updatedCount++;
  } else {
    // Add new
    updatedGlossary.push({
      id: newTerm.id,
      term: newTerm.term,
      abbr: null,
      definition: newTerm.definition,
      categories: ["General"],
      tldr: newTerm.tldr,
      deepDive: newTerm.deepDive
    });
    addedCount++;
  }
});

fs.writeFileSync(JSON_FILE, JSON.stringify(updatedGlossary, null, 2));
console.log(`Successfully updated glossary.json. Updated: ${updatedCount}, Added: ${addedCount}`);
