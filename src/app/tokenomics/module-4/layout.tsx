import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 4: Agentic Loop Economics | Tokenomics Academy",
  description: "How costs compound in multi-step workflows, tool-calling overhead, and the price of autonomy.",
  alternates: {
    canonical: "/tokenomics/module-4",
  },
};

export default function Module4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
