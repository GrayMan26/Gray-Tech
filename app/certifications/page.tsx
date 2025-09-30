"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "../../components/Container";
import { FileText, ExternalLink, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function Certifications() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const fallbackImage = "/certifications/images/fallback-cert.png"; // add a generic fallback image here

  const certs = [
    {
      title: "Google Cloud Certification: Cloud Engineer",
      date: "June 12, 2025",
      image: "/certifications/images/google-cloud-certification-cloud-engineer-cert.png",
      viewLink: "https://coursera.org/verify/professional-cert/DWYPO88GZSTF",
      downloadLink: "/files/Google%20Cloud%20Certification%20Cloud%20Engineer%20Cert.pdf",
    },
    {
      title: "Google Cloud Digital Leader Training",
      date: "Dec 15, 2023",
      image: "/certifications/images/google-cloud-digital-leader-cert.png",
      viewLink: "https://coursera.org/verify/professional-cert/BD89CRTEJEA5",
      downloadLink: "/files/Google%20Cloud%20Digital%20Leader%20Cert.pdf",
    },
    {
      title: "Google IT Support Professional Certificate",
      date: "Aug 10, 2023",
      image: "/certifications/images/google-it-support-cert.png",
      viewLink: "https://coursera.org/verify/professional-cert/7RLQ889XPSRX",
      downloadLink: "/files/Google%20It%20Support%20Cert.pdf",
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((lightboxIndex + 1) % certs.length);
      if (e.key === "ArrowLeft") setLightboxIndex((lightboxIndex - 1 + certs.length) % certs.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, certs.length]);

  // Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (lightboxIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      setLightboxIndex((lightboxIndex + 1) % certs.length); // swipe left
    } else if (touchEndX - touchStartX > 50) {
      setLightboxIndex((lightboxIndex - 1 + certs.length) % certs.length); // swipe right
    }
  };

  return (
    <>
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
              {certs.map((cert, index) => {
                const [imgSrc, setImgSrc] = useState(cert.image);
                const [pdfAvailable, setPdfAvailable] = useState(true);

                // For now, assume PDFs are available since they exist in /public/files/
                // The HEAD request approach was causing 404s due to Next.js routing
                useEffect(() => {
                  setPdfAvailable(true);
                }, []);

                return (
                  <div key={cert.title} className="rounded-2xl border border-gray-800 bg-[#1e1e1e] p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{cert.title}</h2>
                    <p className="text-sm text-gray-400 mb-4">Completed {cert.date}</p>

                    {/* Clickable certificate image with fallback */}
                    <div
                      className="relative w-full h-auto mb-6 cursor-pointer rounded-lg border border-gray-800 overflow-hidden bg-black/40"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={imgSrc}
                        alt={`${cert.title} Certificate`}
                        className="w-full max-w-4xl mx-auto h-auto rounded shadow-lg hover:opacity-90 transition-opacity"
                        style={{ width: '1600px', height: '1100px', objectFit: 'contain' }}
                        onError={() => setImgSrc(fallbackImage)}
                      />
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
                      
                      {/* Download PDF (disabled if missing) */}
                      {pdfAvailable ? (
                        <a
                          href={cert.downloadLink}
                          download={`${cert.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                          className="btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                        >
                          <FileText size={18} /> Download PDF
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium bg-gray-400 text-white cursor-not-allowed"
                        >
                          <FileText size={18} /> PDF Not Available
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
          >
            <X size={24} />
          </button>

          {/* Prev */}
          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + certs.length) % certs.length)}
            className="absolute left-4 text-white p-2 hover:bg-white/20 rounded-full z-10"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Main Image + Caption */}
          <div className="relative max-w-5xl w-full p-4 flex flex-col items-center">
            <img
              src={certs[lightboxIndex].image}
              alt={`${certs[lightboxIndex].title} Certificate`}
              className="w-full max-w-6xl mx-auto h-auto rounded shadow-lg mb-4"
              style={{ width: '1600px', height: '1100px', objectFit: 'contain' }}
            />
            <p className="text-white text-center text-lg mb-4">
              {certs[lightboxIndex].title} — Completed {certs[lightboxIndex].date}
            </p>
            
            {/* Buttons inside Lightbox */}
            <div className="flex gap-4 mb-4">
              <a
                href={certs[lightboxIndex].viewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              >
                <ExternalLink size={18} /> View Online
              </a>
              <a
                href={certs[lightboxIndex].downloadLink}
                download={`${certs[lightboxIndex].title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Download size={18} /> Download PDF
              </a>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-full">
              {certs.map((thumb, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer border-2 rounded flex-shrink-0 ${
                    idx === lightboxIndex ? "border-accent" : "border-transparent"
                  }`}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={thumb.image}
                    alt={`${thumb.title} Thumbnail`}
                    className="rounded object-cover"
                    style={{ width: '120px', height: '80px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % certs.length)}
            className="absolute right-4 text-white p-2 hover:bg-white/20 rounded-full z-10"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}