'use client'

import { useState } from 'react'
import Container from "../../components/Container";
import Button from "../../components/Button";

// Note: This metadata export won't work in client components, but we'll handle SEO in layout
// export const metadata: Metadata = {
//   title: "Contact | GrayTech Help",
//   description: "Get in touch with GrayTech Help for tech support in Philadelphia. Call (610) 241-6947 or email graytechhelp@gmail.com.",
// };

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        // Fallback to mailto
        const subject = encodeURIComponent('Tech Help Request')
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`)
        window.location.href = `mailto:graytechhelp@gmail.com?subject=${subject}&body=${body}`
      }
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent('Tech Help Request')
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`)
      window.location.href = `mailto:graytechhelp@gmail.com?subject=${subject}&body=${body}`
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Get in touch
              </h1>
              <p className="text-lg text-gray-600">
                Same- or next-day responses for most requests.
              </p>
            </div>

            {/* Direct Contact Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="tel:+16102416947"
                className="rounded-2xl border border-gray-200 p-6 text-center space-y-3 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  Call or Text
                </h3>
                <p className="text-2xl font-bold text-accent">
                  (610) 241-6947
                </p>
              </a>

              <a 
                href="mailto:graytechhelp@gmail.com?subject=Tech%20Help%20Request"
                className="rounded-2xl border border-gray-200 p-6 text-center space-y-3 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  Email
                </h3>
                <p className="text-lg text-accent break-all">
                  graytechhelp@gmail.com
                </p>
              </a>
            </div>

            {/* Contact Form */}
            <div className="border-t border-gray-200 pt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Or send us a message
                </h2>
                <p className="text-gray-600">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center space-y-4 p-8 bg-green-50 rounded-2xl">
                  <h3 className="text-xl font-semibold text-green-800">
                    Thanks for reaching out!
                  </h3>
                  <p className="text-green-600">
                      We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="secondary"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      How can we help? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Tell us about your tech challenge..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
