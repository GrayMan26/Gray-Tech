import Container from "../../components/Container";
import Button from "../../components/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | GrayTech Help",
  description: "Complete tech services in Philadelphia: printer setup, computer setup, PC building, server maintenance, Wi-Fi troubleshooting, and more.",
};

export default function Services() {
  const services = [
    {
      id: "printer-setup",
      title: "Printer Setup",
      description: "Install and configure printers (USB/Wi-Fi), drivers, and sharing across devices."
    },
    {
      id: "computer-setup", 
      title: "Computer Setup",
      description: "New Mac/PC setup, user accounts, backups, basic security, essential apps."
    },
    {
      id: "pc-building",
      title: "PC Building", 
      description: "Custom desktop builds for work or gaming: parts guidance, assembly, OS, and stress testing."
    },
    {
      id: "server-maintenance",
      title: "Server Maintenance",
      description: "Small-office file servers and NAS: setup, updates, permissions, monitoring basics."
    },
    {
      id: "connectivity",
      title: "Connectivity & Wi-Fi",
      description: "Fix slow/spotty Wi-Fi, extend coverage, optimize routers and mesh systems."
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting & Tune-ups",
      description: "Diagnostics, malware checks, cleanup, performance improvements."
    }
  ];

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Our Services
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From simple setups to complex builds, we handle the tech so you can focus on what matters.
              </p>
            </div>

            <div className="space-y-8">
              {services.map((service) => (
                <div 
                  key={service.id}
                  id={service.id}
                  className="rounded-2xl border border-gray-200 p-8 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Don&apos;t see what you need?
              </h3>
              <p className="text-gray-600">
                We handle special requests all the time. Get in touch.
              </p>
              <Button href="/contact" variant="primary">
                Contact us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
