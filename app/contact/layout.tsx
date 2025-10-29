import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | GrayTech",
  description: "Get in touch with GrayTech Inc for tech support in Philadelphia and Orlando. Call (610) 241-6947 or email graytechhelp@gmail.com.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
