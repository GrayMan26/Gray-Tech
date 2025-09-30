import Container from "../../components/Container";
import { FileText, ExternalLink } from "lucide-react";

export default function Certifications() {
  const certs = [
    {
      title: "Google Cloud Certification: Cloud Engineer",
      date: "June 12, 2025",
      viewLink: "https://coursera.org/verify/professional-cert/DWYPO88GZSTF",
      downloadLink: "/certifications/google-cloud-certification-cloud-engineer-cert.pdf",
    },
    {
      title: "Google Cloud Digital Leader Training",
      date: "Dec 15, 2023",
      viewLink: "https://coursera.org/verify/professional-cert/BD89CRTEJEA5",
      downloadLink: "/certifications/google-cloud-digital-leader-cert.pdf",
    },
    {
      title: "Google IT Support Professional Certificate",
      date: "Aug 10, 2023",
      viewLink: "https://coursera.org/verify/professional-cert/7RLQ889XPSRX",
      downloadLink: "/certifications/google-it-support-cert.pdf",
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
            {certs.map((cert) => (
              <div key={cert.title} className="rounded-2xl border border-gray-800 bg-[#1e1e1e] p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-2">{cert.title}</h2>
                <p className="text-sm text-gray-400 mb-4">Completed {cert.date}</p>

                {/* Inline PDF preview */}
                <div className="rounded-lg border border-gray-800 overflow-hidden mb-6 bg-black/40">
                  <object data={`${cert.downloadLink}#view=FitH`} type="application/pdf" className="w-full" style={{ height: 560 }}>
                    <iframe src={`${cert.downloadLink}#view=FitH`} className="w-full" style={{ height: 560 }} title={`${cert.title} PDF`}></iframe>
                  </object>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={cert.viewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition bg-accent text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    <ExternalLink size={18} /> View Online
                  </a>
                  <a
                    href={cert.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  >
                    <FileText size={18} /> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}


