import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | GrayTech Inc",
  description: "Complete tech services in Philadelphia: printer setup, computer setup, PC building, server maintenance, Wi-Fi troubleshooting, and more.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
