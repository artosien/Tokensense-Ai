import fs from 'fs/promises';
import path from 'path';

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  sections: {
    id: string;
    title?: string;
    content: string;
    type: 'text' | 'hero' | 'grid' | 'terminal';
  }[];
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data/pages.json');

export async function getPagesData(): Promise<PageContent[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<PageContent | undefined> {
  const pages = await getPagesData();
  return pages.find((p) => p.slug === slug);
}

export async function savePage(pageData: Partial<PageContent>): Promise<PageContent> {
  const pages = await getPagesData();
  let page: PageContent;

  const index = pages.findIndex((p) => p.slug === pageData.slug);
  
  if (index !== -1) {
    page = {
      ...pages[index],
      ...pageData,
      updatedAt: new Date().toISOString(),
    } as PageContent;
    pages[index] = page;
  } else {
    page = {
      ...pageData,
      updatedAt: new Date().toISOString(),
    } as PageContent;
    pages.push(page);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(pages, null, 2));
  return page;
}
