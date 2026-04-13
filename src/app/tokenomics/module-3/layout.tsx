import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 3: Deflationary Intelligence | Tokenomics Academy",
  description: "Analyze the 90% drop in cost-per-token and how to architecture systems that stay profitable as prices fall.",
  alternates: {
    canonical: "/tokenomics/module-3",
  },
};

export default function Module3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
