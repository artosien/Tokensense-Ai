import fs from 'fs/promises';
import path from 'path';

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'content' | 'video' | 'interactive' | 'quiz';
  content: string;
  videoUrl?: string;
  interactiveComponent?: string; // e.g., 'TokenizerPlayground'
  status: 'draft' | 'published';
  order: number;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status: 'draft' | 'published';
  order: number;
  lessons: Lesson[];
  image?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data/academy.json');

export async function getAcademyData(): Promise<Module[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return initial empty structure or seed data
    return [];
  }
}

export async function getModuleBySlug(slug: string): Promise<Module | undefined> {
  const modules = await getAcademyData();
  return modules.find((m) => m.slug === slug);
}

export async function saveModule(moduleData: Partial<Module>): Promise<Module> {
  const modules = await getAcademyData();
  let module: Module;

  if (moduleData.id) {
    const index = modules.findIndex((m) => m.id === moduleData.id);
    if (index === -1) throw new Error('Module not found');
    
    module = {
      ...modules[index],
      ...moduleData,
    } as Module;
    modules[index] = module;
  } else {
    module = {
      ...moduleData,
      id: Math.random().toString(36).substring(2, 9),
      lessons: moduleData.lessons || [],
      order: modules.length + 1,
    } as Module;
    modules.push(module);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(modules, null, 2));
  return module;
}

export async function deleteModule(id: string): Promise<void> {
  const modules = await getAcademyData();
  const filtered = modules.filter((m) => m.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
}
