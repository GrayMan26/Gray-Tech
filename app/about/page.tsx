import Container from "../../components/Container";
import Button from "../../components/Button";
import { Metadata } from "next";
import { 
  Heart, 
  Shield, 
  Lightbulb,
  MapPin,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | GrayTech Help",
  description: "Learn about GrayTech Help - a Philadelphia-based tech services company built on simplicity, trust, and care.",
};

export default function About() {
  const values = [
    {
      title: "Simplicity",
      description: "We recommend what works, not what's trendy.",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Trust", 
      description: "Transparent pricing and clear next steps.",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Care",
      description: "We treat your tech like it's our own.",
      icon: <Heart className="h-8 w-8" />,
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="space-y-16">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative w-60 h-75 rounded-2xl overflow-hidden border-2 border-accent/20 shadow-lg">
                  <img
                    src="/images/profile-photo.png"
                    alt="Professional headshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                About GrayTech Inc
              </h1>
              <div className="flex justify-center items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">Philadelphia, Pennsylvania \ Orlando, Florida</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 border border-accent/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="h-6 w-6 text-accent" />
                      <span className="font-semibold text-accent">Our Story</span>
                    </div>
                    <p className="text-lg leading-relaxed text-gray-700">
                      GrayTech Help is a small, Philadelphia-based tech services company built on a simple idea: make technology feel effortless. I hold several certifications from Google and plan to pursue additional credentials to further expand my expertise.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <p className="text-lg leading-relaxed text-gray-600">
                      We help neighbors and local businesses set up, fix, and improve the tools they rely on—from home printers and Wi-Fi to custom PCs and small-office servers.
                    </p>
                  </div>
                </div>
                
                <div className="bg-card-bg rounded-2xl p-8 border border-border shadow-sm transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-foreground mb-4">What sets us apart</h3>
                  <p className="text-lg leading-relaxed text-muted mb-6">
                  Broad technical knowledge and extensive experience in solving a wide range of problems, allowing me to deliver tailored solutions that meet your specific needs. I provide end-to-end support for technical issues and communicate both the problem and its resolution clearly—without unnecessary technical jargon.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-100 rounded-lg transition-colors duration-300">
                      <div className="text-2xl font-bold text-green-600">3+</div>
                      <div className="text-sm text-green-600">Years helping and fixing</div>
                    </div>
                    <div className="text-center p-4 bg-blue-100 rounded-lg transition-colors duration-300">
                      <div className="text-2xl font-bold text-blue-600">20+</div>
                      <div className="text-sm text-blue-600">Happy customers and neighbors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  What we value
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value) => (
                  <div key={value.title} className="text-center space-y-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex justify-center">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${value.color}`}>
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 border border-accent/20">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full">
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                Proudly serving Philadelphia.
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Ready to make your tech work better? Let&apos;s chat about how we can help.
              </p>
              <Button href="/contact" variant="primary" className="px-8 py-3">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
