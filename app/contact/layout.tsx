import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | GrayTech Help",
  description: "Get in touch with GrayTech Help for tech support in Philadelphia. Call (610) 241-6947 or email graytechhelp@gmail.com.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
