import fs from 'fs/promises';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  image: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data/blog-posts.json');

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function saveBlogPost(postData: Partial<BlogPost>): Promise<BlogPost> {
  const posts = await getBlogPosts();
  let post: BlogPost;

  if (postData.id) {
    const index = posts.findIndex((p) => p.id === postData.id);
    if (index === -1) throw new Error('Post not found');
    
    post = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
    } as BlogPost;
    posts[index] = post;
  } else {
    post = {
      ...postData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as BlogPost;
    posts.push(post);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
  return post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const posts = await getBlogPosts();
  const filteredPosts = posts.filter((p) => p.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(filteredPosts, null, 2));
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const now = new Date();
  
  return posts.filter((post) => {
    if (post.status === 'published') return true;
    if (post.status === 'scheduled') {
      return new Date(post.publishDate) <= now;
    }
    return false;
  }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}
