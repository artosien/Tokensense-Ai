import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 5: Building with LLMs | Tokenomics Academy",
  description: "Shift from prototyping to production by mastering API cost constraints, batch economics, and system architecture trade-offs.",
  alternates: {
    canonical: "/tokenomics/module-5",
  },
};

export default function Module5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
