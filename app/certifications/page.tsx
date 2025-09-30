import Container from "../../components/Container";
import Button from "../../components/Button";

export default function Certifications() {
  const items = [
    {
      title: "Google Cloud Certification: Cloud Engineer",
      date: "Completed June 12, 2025",
      viewUrl: "https://coursera.org/verify/professional-cert/DWYPO88GZSTF",
      pdfPath: "/files/Google%20Cloud%20Certification%20Cloud%20Engineer%20Cert.pdf",
    },
    {
      title: "Google Cloud Digital Leader Training",
      date: "Completed Dec 15, 2023",
      viewUrl: "https://coursera.org/verify/professional-cert/BD89CRTEJEA5",
      pdfPath: "/files/Google%20Cloud%20Digital%20Leader%20Cert.pdf",
    },
    {
      title: "Google IT Support Professional Certificate",
      date: "Completed Aug 10, 2023",
      viewUrl: "https://coursera.org/verify/professional-cert/7RLQ889XPSRX",
      pdfPath: "/files/Google%20It%20Support%20Cert.pdf",
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Certifications</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Verified credentials and certificates. View online or download as PDF.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {items.map((cert) => (
              <div key={cert.title} className="rounded-2xl border border-gray-800 bg-[#1e1e1e] p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-2">{cert.title}</h2>
                <p className="text-sm text-gray-400 mb-6">{cert.date}</p>
                <div className="flex flex-wrap gap-3">
                  <Button href={cert.viewUrl} variant="primary" target="_blank" rel="noopener noreferrer" className="px-6">
                    View Online
                  </Button>
                  <Button href={cert.pdfPath} variant="secondary" download className="px-6">
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}


