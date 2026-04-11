"use server";

import { savePage, PageContent } from "@/lib/page-service";
import { revalidatePath } from "next/cache";

// Simple check for local/development only
const isLocalOnly = () => process.env.NODE_ENV === "development";

export async function savePageAction(pageData: Partial<PageContent>) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  const savedPage = await savePage(pageData);
  revalidatePath(`/${savedPage.slug}`);
  revalidatePath("/admin/pages");
  return savedPage;
}
