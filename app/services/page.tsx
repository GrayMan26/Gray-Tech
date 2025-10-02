import Container from "../../components/Container";
import Button from "../../components/Button";
import { Metadata } from "next";
import { 
  Printer, 
  Monitor, 
  Cpu, 
  Server, 
  Wifi, 
  Wrench,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | GrayTech Help",
  description: "Complete tech services in Philadelphia: printer setup, computer setup, PC building, server maintenance, Wi-Fi troubleshooting, and more.",
};

export default function Services() {
  const services = [
    {
      id: "printer-setup",
      title: "Printer Setup",
      description: "Install and configure printers (USB/Wi-Fi), drivers, and sharing across devices.",
      icon: <Printer className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "computer-setup", 
      title: "Computer Setup",
      description: "New Mac/PC setup, user accounts, backups, basic security, essential apps.",
      icon: <Monitor className="h-8 w-8" />,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "pc-building",
      title: "PC Building", 
      description: "Custom desktop builds for work or gaming: parts guidance, assembly, OS, and stress testing.",
      icon: <Cpu className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "server-maintenance",
      title: "Server Maintenance",
      description: "Small-office file servers and NAS: setup, updates, permissions, monitoring basics.",
      icon: <Server className="h-8 w-8" />,
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: "connectivity",
      title: "Connectivity & Wi-Fi",
      description: "Fix slow/spotty Wi-Fi, extend coverage, optimize routers and mesh systems.",
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting & Tune-ups",
      description: "Diagnostics, malware checks, cleanup, performance improvements.",
      icon: <Wrench className="h-8 w-8" />,
      color: "bg-red-100 text-red-600"
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
                From simple setups to complex builds, we handle the tech so you can focus on what matters. Prices are based on the complexity of the task and the time it takes to complete.
              </p>
            </div>

            <div className="space-y-6">
              {services.map((service) => (
                <div 
                  key={service.id}
                  id={service.id}
                  className="rounded-2xl border border-gray-200 p-8 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${service.color} flex-shrink-0`}>
                      {service.icon}
                    </div>
                    <div className="flex-1 space-y-4">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center text-accent hover:text-accent/80 transition-colors">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 text-center space-y-6 border border-accent/20">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full">
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                Don&apos;t see what you need?
              </h3>
              <p className="text-gray-600 text-lg">
                We handle special requests all the time. Get in touch and let&apos;s discuss your specific tech challenge.
              </p>
              <Button href="/contact" variant="primary" className="px-8 py-3">
                Contact us today
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
