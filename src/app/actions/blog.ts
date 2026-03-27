"use server";

import { saveBlogPost, deleteBlogPost, getBlogPosts, BlogPost } from "@/lib/blog-service";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// Simple check for local/development only
const isLocalOnly = () => process.env.NODE_ENV === "development";

export async function savePostAction(postData: Partial<BlogPost>) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  const savedPost = await saveBlogPost(postData);
  revalidatePath("/blog");
  revalidatePath(`/blog/${savedPost.slug}`);
  revalidatePath("/admin/blog");
  return savedPost;
}

export async function deletePostAction(id: string) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  await deleteBlogPost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function uploadMediaAction(formData: FormData) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const filePath = path.join(process.cwd(), "public/images/blog", fileName);

  await fs.writeFile(filePath, buffer);
  return `/images/blog/${fileName}`;
}

export async function listExistingMediaAction() {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  const mediaPath = path.join(process.cwd(), "public/images/blog");
  try {
    const files = await fs.readdir(mediaPath);
    return files.filter(f => !f.startsWith(".")).map(f => `/images/blog/${f}`);
  } catch (error) {
    return [];
  }
}
