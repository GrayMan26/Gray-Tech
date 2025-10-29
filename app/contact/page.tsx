'use client'

import { useState } from 'react'
import Container from "../../components/Container";
import Button from "../../components/Button";
import { 
  Phone, 
  Mail, 
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Send
} from "lucide-react";

// Note: This metadata export won't work in client components, but we'll handle SEO in layout
// export const metadata: Metadata = {
//   title: "Contact | GrayTech Inc",
//   description: "Get in touch with GrayTech Inc for tech support in Philadelphia. Call (610) 241-6947 or email graytechhelp@gmail.com.",
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
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-20 h-20 bg-accent/10 rounded-2xl border border-accent/20">
                  <MessageSquare className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Get in touch
              </h1>
              <div className="flex justify-center items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-lg">Same- or next-day responses for most requests</span>
              </div>
            </div>

            {/* Direct Contact Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="tel:+16102416947"
                className="rounded-2xl border border-gray-200 p-6 text-center space-y-4 hover:shadow-md transition-all hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 bg-white"
              >
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Call or Text
                </h3>
                <p className="text-2xl font-bold text-accent">
                  (610) 241-6947
                </p>
                <p className="text-sm text-gray-500">Available 9 AM - 7 PM</p>
              </a>

              <a 
                href="mailto:graytechhelp@gmail.com?subject=Tech%20Help%20Request"
                className="rounded-2xl border border-gray-200 p-6 text-center space-y-4 hover:shadow-md transition-all hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 bg-white"
              >
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Email
                </h3>
                <p className="text-lg text-accent break-all">
                  graytechhelp@gmail.com
                </p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
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
                <div className="text-center space-y-6 p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800">
                    Thanks for reaching out!
                  </h3>
                  <p className="text-green-700 text-lg">
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
                    className="w-full text-lg py-4"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Service Area */}
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 text-center space-y-4 border border-accent/20">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Service Area
              </h3>
              <p className="text-gray-600">
                Proudly serving Philadelphia and Orlando areas. On-site visits available within 50 miles of current location.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
