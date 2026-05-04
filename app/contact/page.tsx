import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMetadata, organizationSchema } from "@/lib/seo-utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export const metadata: Metadata = createMetadata({
  title: "Contact Dunamis EdTech | Ikorodu Lagos & Abuja Nigeria",
  description: "Contact Dunamis EdTech in Lagos (Ikorodu) and Abuja. Phone: +234 703 209 0178, WhatsApp, Email. Free education consultation. Open Monday-Saturday.",
  url: "https://www.dunamisedtech.com/contact"
})

const contactInfo = [
  {
    icon: MapPin,
    title: "Lagos Office",
    details: ["Limited Bus Stop, Ijede Road", "Ikorodu, Lagos"],
    action: "Get Directions",
    href: "https://maps.google.com",
  },
  {
    icon: MapPin,
    title: "Abuja Office",
    details: ["1st Avenue", "Gwarimpa, Abuja"],
    action: "Get Directions",
    href: "https://maps.google.com",
  },
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    details: ["+234 703 209 0178"],
    action: "Call Now",
    href: "tel:+2347032090178",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@dunamisedutech.com"],
    action: "Send Email",
    href: "mailto:info@dunamisedutech.com",
  },
]

const officeHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <Navigation />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold md:text-5xl">Get in Touch</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Have questions about our courses or study abroad programs? We&apos;re here to help you start your journey to success.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold">Send us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+234 XXX XXX XXXX" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="What is your inquiry about?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="courses">Tech Courses</SelectItem>
                        <SelectItem value="study-abroad">Study Abroad Programs</SelectItem>
                        <SelectItem value="payment">Payment & Pricing</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="mt-2 text-muted-foreground">
                  Reach out to us through any of these channels.
                </p>

                <div className="mt-8 grid gap-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                        ))}
                        <Link 
                          href={info.href}
                          className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                        >
                          {info.action}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Office Hours */}
                <div className="mt-8 rounded-lg border border-border p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Office Hours</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    {officeHours.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-8 rounded-lg bg-[#25D366]/10 p-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    <div>
                      <h3 className="font-semibold">Quick Response via WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">
                        Get instant answers to your questions
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="mt-4 w-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
                    asChild
                  >
                    <Link href="https://wa.me/2347032090178?text=Hello%20Dunamis%20EdTech!%20I%20would%20like%20to%20learn%20more%20about%20your%20courses." target="_blank">
                      Chat on WhatsApp
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">Our Locations</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-muted p-4">
                  <h3 className="font-semibold">Lagos Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Limited Bus Stop, Ijede Road, Ikorodu, Lagos
                  </p>
                </div>
                <div className="aspect-video bg-muted/50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126846.18296652068!2d3.3138828!3d6.5480348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1702000000000!5m2!1sen!2sng"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lagos Office Location"
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-muted p-4">
                  <h3 className="font-semibold">Abuja Office</h3>
                  <p className="text-sm text-muted-foreground">
                    1st Avenue, Gwarimpa, Abuja
                  </p>
                </div>
                <div className="aspect-video bg-muted/50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126093.80568605!2d7.3986208!3d9.0764785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e745f4cd62fd9%3A0x53bd17b4a20ea12b!2sAbuja!5e0!3m2!1sen!2sng!4v1702000000000!5m2!1sen!2sng"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Abuja Office Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
