"use client";

import Container from "../../components/Container";
import Button from "../../components/Button";
import { useState, useRef, useEffect } from "react";
import { 
  Printer, 
  Monitor, 
  Cpu, 
  Server, 
  Wifi, 
  Wrench,
  CheckCircle,
  ChevronDown,
  X
} from "lucide-react";

export default function Services() {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [animatingServices, setAnimatingServices] = useState<Set<string>>(new Set());
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const services = [
    {
      id: "printer-setup",
      title: "Printer Setup",
      description: "Install and configure printers (USB/Wi-Fi), drivers, and sharing across devices.",
      detailedDescription: "Complete printer setup service including hardware installation, driver configuration, wireless network connection, and device sharing setup across multiple computers. We handle everything from basic inkjet printers to complex multifunction devices and business-grade equipment.",
      features: [
        "USB and wireless printer installation",
        "Driver download and configuration",
        "Network printer sharing setup",
        "Print queue optimization",
        "Mobile printing configuration",
        "Troubleshooting connectivity issues"
      ],
      pricing: {
        basic: "$50-75",
        advanced: "$75-125",
        details: "Basic setup for single printer, Advanced includes multiple devices and network sharing"
      },
      icon: <Printer className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "computer-setup", 
      title: "Computer Setup",
      description: "New Mac/PC setup, user accounts, backups, basic security, essential apps.",
      detailedDescription: "Comprehensive new computer setup service covering initial configuration, user account creation, data migration, security implementation, and essential software installation. Perfect for new purchases or fresh installations.",
      features: [
        "Initial system configuration",
        "User account and profile setup",
        "Data migration from old devices",
        "Essential software installation",
        "Security software configuration",
        "Backup system setup",
        "Windows/macOS optimization"
      ],
      pricing: {
        basic: "$100-150",
        advanced: "$150-250",
        details: "Basic includes setup and essential software, Advanced includes data migration and optimization"
      },
      icon: <Monitor className="h-8 w-8" />,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "pc-building",
      title: "PC Building", 
      description: "Custom desktop builds for work or gaming: parts guidance, assembly, OS, and stress testing.",
      detailedDescription: "Professional custom PC building service from component selection to final testing. Whether you need a powerful workstation or high-end gaming rig, we provide expert guidance on parts selection, professional assembly, and thorough testing.",
      features: [
        "Component compatibility analysis",
        "Parts selection and procurement",
        "Professional assembly",
        "Cable management",
        "Operating system installation",
        "Driver and software setup",
        "Stress testing and benchmarking",
        "Warranty and support guidance"
      ],
      pricing: {
        basic: "$150-250",
        advanced: "$250-400",
        details: "Assembly only (parts provided by customer) vs Full service including consultation and procurement"
      },
      icon: <Cpu className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "server-maintenance",
      title: "Server Maintenance",
      description: "Small-office file servers and NAS: setup, updates, permissions, monitoring basics.",
      detailedDescription: "Specialized server and NAS maintenance for small businesses and home offices. Keep your data safe and accessible with regular maintenance, security updates, and performance optimization.",
      features: [
        "Server health monitoring setup",
        "Security updates and patches",
        "User permissions management",
        "Backup verification",
        "Performance optimization",
        "Storage expansion planning",
        "Remote access configuration",
        "Disaster recovery planning"
      ],
      pricing: {
        basic: "$125-200",
        advanced: "$200-350",
        details: "Basic maintenance and updates vs Comprehensive setup and ongoing monitoring"
      },
      icon: <Server className="h-8 w-8" />,
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: "connectivity",
      title: "Connectivity & Wi-Fi",
      description: "Fix slow/spotty Wi-Fi, extend coverage, optimize routers and mesh systems.",
      detailedDescription: "Complete wireless network solutions including troubleshooting slow connections, extending coverage to dead zones, optimizing router placement, and configuring mesh systems for seamless connectivity throughout your space.",
      features: [
        "Wi-Fi speed and coverage analysis",
        "Router placement optimization",
        "Mesh network setup and configuration",
        "Network security enhancement",
        "Guest network configuration",
        "Smart device connectivity",
        "ISP speed verification",
        "Network equipment recommendations"
      ],
      pricing: {
        basic: "$75-125",
        advanced: "$125-225",
        details: "Basic troubleshooting and optimization vs Full mesh network setup and configuration"
      },
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting & Tune-ups",
      description: "Diagnostics, malware checks, cleanup, performance improvements.",
      detailedDescription: "Comprehensive computer diagnostics and performance optimization. From mysterious crashes to sluggish performance, we identify and resolve issues while implementing preventive measures to keep your system running smoothly.",
      features: [
        "Hardware diagnostic testing",
        "Malware and virus removal",
        "System cleanup and optimization",
        "Startup program management",
        "Registry cleaning and repair",
        "Storage optimization",
        "Temperature monitoring",
        "Performance benchmarking"
      ],
      pricing: {
        basic: "$85-135",
        advanced: "$135-225",
        details: "Basic cleanup and malware removal vs Comprehensive diagnostics and optimization"
      },
      icon: <Wrench className="h-8 w-8" />,
      color: "bg-red-100 text-red-600"
    }
  ];

  // Handle dropdown toggle with staggered animation
  const toggleDropdown = (serviceId: string) => {
    setAnimatingServices(prev => new Set([...prev, serviceId]));
    
    if (expandedServices.has(serviceId)) {
      // Closing
      setExpandedServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
    } else {
      // Opening - add staggered delay if multiple are opening
      const currentlyAnimating = animatingServices.size;
      const delay = currentlyAnimating * 75; // 75ms stagger
      
      setTimeout(() => {
        setExpandedServices(prev => new Set([...prev, serviceId]));
      }, delay);
    }
    
    // Clear animation state after animation completes
    setTimeout(() => {
      setAnimatingServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
    }, 400);
  };

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if click is outside all dropdown areas
      const isOutsideAll = Array.from(expandedServices).every(serviceId => {
        const dropdown = dropdownRefs.current[serviceId];
        const serviceCard = document.getElementById(serviceId);
        return dropdown && serviceCard && 
               !dropdown.contains(target) && 
               !serviceCard.contains(target);
      });
      
      if (isOutsideAll) {
        setExpandedServices(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedServices]);

  // Auto-scroll when dropdown opens
  useEffect(() => {
    expandedServices.forEach(serviceId => {
      const serviceElement = document.getElementById(serviceId);
      if (serviceElement) {
        setTimeout(() => {
          serviceElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 200); // Delay to allow dropdown animation to start
      }
    });
  }, [expandedServices]);

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
              {services.map((service) => {
                const isExpanded = expandedServices.has(service.id);
                
                return (
                  <div key={service.id} className="relative">
                    <div 
                      id={service.id}
                      className="rounded-2xl border border-gray-200 p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300"
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
                          <button
                            onClick={() => toggleDropdown(service.id)}
                            className="learn-more-btn group flex items-center text-accent hover:text-accent/80 active:text-accent/70 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/20 rounded-lg px-2 py-1 -ml-2"
                          >
                            <span className="text-sm font-medium group-hover:font-semibold transition-all duration-200">
                              Learn more
                            </span>
                            <div className="ml-2 relative">
                              <ChevronDown 
                                className={`icon-morph h-4 w-4 ${
                                  isExpanded ? 'rotate-180 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                                }`}
                              />
                              <X 
                                className={`icon-morph h-4 w-4 absolute inset-0 ${
                                  isExpanded ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'
                                }`}
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Content */}
                    <div
                      ref={(el) => {
                        if (el) {
                          dropdownRefs.current[service.id] = el;
                        }
                      }}
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isExpanded 
                          ? 'max-h-[2000px] opacity-100 transform translate-y-0 scale-100' 
                          : 'max-h-0 opacity-0 transform -translate-y-4 scale-95'
                      }`}
                    >
                      <div className="service-dropdown mt-4 rounded-2xl overflow-hidden relative">
                        {/* Fixed Close Button */}
                        <button
                          onClick={() => toggleDropdown(service.id)}
                          className="close-btn absolute top-4 right-4 z-10 p-2 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 shadow-md"
                        >
                          <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        <div className="p-8 pr-16 space-y-6">
                          {/* Detailed Description */}
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                              About This Service
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {service.detailedDescription}
                            </p>
                          </div>

                          {/* Features */}
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                              What&apos;s Included
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {service.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Pricing */}
                          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 border border-accent/20">
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                              Pricing
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50">
                                <div className="text-2xl font-bold text-accent">
                                  {service.pricing.basic}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Basic Service
                                </div>
                              </div>
                              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50">
                                <div className="text-2xl font-bold text-accent">
                                  {service.pricing.advanced}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Advanced Service
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                              {service.pricing.details}
                            </p>
                          </div>

                          {/* Call to Action */}
                          <div className="text-center pt-4">
                            <Button href="/contact" variant="primary" className="px-8 py-3">
                              Get Started with {service.title}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
