import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 6: Model Comparison Guide | Tokenomics Academy",
  description: "Navigate the crowded AI market, understand proprietary vs. open-source trade-offs, and architect systems that route tasks to the most cost-effective AI.",
  alternates: {
    canonical: "/tokenomics/module-6",
  },
};

export default function Module6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
