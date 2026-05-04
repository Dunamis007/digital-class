import type { Metadata } from 'next'
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { CoursesSection } from "@/components/courses-section"
import { StudyAbroadSection } from "@/components/study-abroad-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { createMetadata, organizationSchema, homepageFAQSchema } from "@/lib/seo-utils"

export const metadata: Metadata = createMetadata({
  title: "Best Tech Training Institute in Lagos | AI, Cybersecurity & Cloud Courses | Dunamis EdTech",
  description: "Dunamis EdTech is the best tech training institute in Lagos, Ikorodu. Learn AI, cybersecurity, cloud computing and more. 87% job placement rate. Enrol today.",
  url: "https://www.dunamisedtech.com/",
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFAQSchema) }}
      />
      
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <CoursesSection />
        <StudyAbroadSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
