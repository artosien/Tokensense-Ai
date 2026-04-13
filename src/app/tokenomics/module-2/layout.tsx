import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 2: The Asymmetric Bill | Tokenomics Academy",
  description: "Learn why providers charge more for generation than processing, and how to optimize your prompt-to-completion ratio.",
  alternates: {
    canonical: "/tokenomics/module-2",
  },
};

export default function Module2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
