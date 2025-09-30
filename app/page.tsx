import Container from "../components/Container";
import Button from "../components/Button";
import ServiceCard from "../components/ServiceCard";
import { 
  Printer, 
  Monitor, 
  Cpu, 
  Server, 
  Wifi, 
  HelpCircle 
} from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "Printer Setup",
      description: "Install and configure printers, drivers, and sharing across devices.",
      icon: <Printer className="h-5 w-5" />,
      href: "/services#printer-setup"
    },
    {
      title: "Computer Setup",
      description: "New Mac/PC setup, user accounts, backups, and essential apps.",
      icon: <Monitor className="h-5 w-5" />,
      href: "/services#computer-setup"
    },
    {
      title: "PC Building",
      description: "Custom desktop builds for work or gaming with parts guidance.",
      icon: <Cpu className="h-5 w-5" />,
      href: "/services#pc-building"
    },
    {
      title: "Server Maintenance",
      description: "Small-office file servers and NAS setup and monitoring.",
      icon: <Server className="h-5 w-5" />,
      href: "/services#server-maintenance"
    },
    {
      title: "Wi-Fi & Connectivity",
      description: "Fix slow Wi-Fi, extend coverage, optimize routers and mesh systems.",
      icon: <Wifi className="h-5 w-5" />,
      href: "/services#connectivity"
    },
    {
      title: "Something else?",
      description: "We handle special requests all the time. Get in touch.",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/contact"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Friendly, local tech help—done right.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From printer setup to small-office servers, GrayTech Help keeps your tech simple and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Get help now
              </Button>
              <Button href="/services">
                See services
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How we help
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From simple setups to complex builds, we handle the tech so you can focus on what matters.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href={service.href}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <Container>
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why choose us
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Local & responsive
                </h3>
                <p className="text-gray-600">
                  Same- or next-day help in Philly.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Plain-English explanations
                </h3>
                <p className="text-gray-600">
                  No jargon, no upsell.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Fair, transparent pricing
                </h3>
                <p className="text-gray-600">
                  Flat or hourly options.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-accent">
        <Container>
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Text or call now: <a href="tel:+16102416947" className="hover:underline">(610) 241-6947</a>
            </h2>
            <Button href="/contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}