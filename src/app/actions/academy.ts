"use server";

import { saveModule, deleteModule, Module } from "@/lib/academy-service";
import { revalidatePath } from "next/cache";

// Simple check for local/development only
const isLocalOnly = () => process.env.NODE_ENV === "development";

export async function saveModuleAction(moduleData: Partial<Module>) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  const savedModule = await saveModule(moduleData);
  revalidatePath("/tokenomics");
  revalidatePath(`/tokenomics/${savedModule.slug}`);
  revalidatePath("/admin/academy");
  return savedModule;
}

export async function deleteModuleAction(id: string) {
  if (!isLocalOnly()) throw new Error("Unauthorized: Local development only");
  
  await deleteModule(id);
  revalidatePath("/tokenomics");
  revalidatePath("/admin/academy");
}
