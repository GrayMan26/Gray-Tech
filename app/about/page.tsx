import Container from "../../components/Container";
import Button from "../../components/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | GrayTech Help",
  description: "Learn about GrayTech Help - a Philadelphia-based tech services company built on simplicity, trust, and care.",
};

export default function About() {
  const values = [
    {
      title: "Simplicity",
      description: "We recommend what works, not what's trendy."
    },
    {
      title: "Trust", 
      description: "Transparent pricing and clear next steps."
    },
    {
      title: "Care",
      description: "We treat your tech like it's our own."
    }
  ];

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                About GrayTech Help
              </h1>
            </div>

            <div className="prose prose-lg max-w-3xl mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                GrayTech Help is a small, Philadelphia-based tech services company built on a simple idea: make technology feel effortless. We help neighbors and local businesses set up, fix, and improve the tools they rely on—from home printers and Wi-Fi to custom PCs and small-office servers.
              </p>
              
              <p className="text-xl leading-relaxed mb-6">
                What sets us apart is how we work: clear pricing, plain-English explanations, and solutions that fit your actual needs. No upsell, no jargon—just friendly, reliable help when you need it.
              </p>
            </div>

            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  What we value
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value) => (
                  <div key={value.title} className="text-center space-y-4">
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

            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">
                Proudly serving Philadelphia.
              </h3>
              <Button href="/contact" variant="primary">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
