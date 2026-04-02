import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Account | Tokensense-Ai",
  description: "Manage your Tokensense-Ai account, view your calculation history, and customize your model presets.",
  alternates: {
    canonical: '/account',
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
