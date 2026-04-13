import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 1: The Atomic Unit of AI | Tokenomics Academy",
  description: "Understand how LLMs read text, the difference between words and tokens, and why it matters for your budget.",
  alternates: {
    canonical: "/tokenomics/module-1",
  },
};

export default function Module1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
