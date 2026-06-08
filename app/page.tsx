import Container from "../components/Container";
import Button from "../components/Button";
import ServiceCard from "../components/ServiceCard";
import { 
  Printer, 
  Monitor, 
  Cpu, 
  Server, 
  Wifi, 
  HelpCircle,
  Shield,
  Clock,
  MessageCircle,
  CheckCircle,
  Zap,
  Users
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
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-background to-gray-light transition-colors duration-300">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E5E7EB' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <Container className="relative">
          <div className="text-center space-y-8">
            {/* Tech Icon Cluster */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 bg-accent/10 rounded-2xl border border-accent/20">
                  <Zap className="h-12 w-12 text-accent" />
                </div>
                {/* Floating icons */}
                <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-card-bg rounded-full shadow-lg border border-border transition-colors duration-300">
                  <Monitor className="h-4 w-4 text-muted" />
                </div>
                <div className="absolute -bottom-2 -left-2 flex items-center justify-center w-8 h-8 bg-card-bg rounded-full shadow-lg border border-border transition-colors duration-300">
                  <Printer className="h-4 w-4 text-muted" />
                </div>
                <div className="absolute top-1/2 -left-6 flex items-center justify-center w-6 h-6 bg-card-bg rounded-full shadow-md border border-border transition-colors duration-300">
                  <Wifi className="h-3 w-3 text-muted" />
                </div>
                <div className="absolute top-1/2 -right-6 flex items-center justify-center w-6 h-6 bg-card-bg rounded-full shadow-md border border-border transition-colors duration-300">
                  <Server className="h-3 w-3 text-muted" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-accent mb-2">
              GrayTech Inc
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Friendly, local tech help—
              <span className="text-accent">done right</span>.
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              From printer setup to small-office servers, GrayTech Inc keeps your tech simple and reliable. 
              <span className="block mt-2 text-lg">📍 Proudly serving Philadelphia and the tri-state area</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button href="/contact" variant="primary" className="text-lg px-8 py-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                Get help now
              </Button>
              <Button href="/services" className="text-lg px-8 py-4">
                See all services
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Same-day service
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Licensed & insured
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Local Philadelphia team
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-light transition-colors duration-300">
        <Container>
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How we help
              </h2>
              <p className="text-muted max-w-2xl mx-auto">
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
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card-bg border border-border shadow-sm transition-colors duration-300">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Local & responsive
                </h3>
                <p className="text-muted">
                  Same- or next-day help in Philly.
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card-bg border border-border shadow-sm transition-colors duration-300">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Plain-English explanations
                </h3>
                <p className="text-muted">
                  No jargon, no upsell.
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card-bg border border-border shadow-sm transition-colors duration-300">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Fair, transparent pricing
                </h3>
                <p className="text-muted">
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
              Text or call now: <a href="tel:+16102416947" className="hover:underline text-white">(610) 241-6947</a>
            </h2>
              <Button href="/contact" variant="primary">
              Get in touch
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}