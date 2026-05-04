import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CourseCatalog } from "@/components/course-catalog"
import { createMetadata, organizationSchema } from "@/lib/seo-utils"

export const metadata: Metadata = createMetadata({
  title: "Tech Courses in Nigeria | AI, Cybersecurity, Cloud Computing, Coding | Dunamis EdTech",
  description: "Best tech courses in Nigeria. Learn AI, cybersecurity, cloud computing, coding, data science in Lagos. 87% job placement rate. Dunamis EdTech Nigeria. Enrol today.",
  url: "https://www.dunamisedtech.com/courses"
})

// Course listing schema for SEO
const courseListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Tech Courses in Nigeria",
  "description": "Professional tech training courses available at Dunamis EdTech in Lagos, Nigeria",
  "numberOfItems": 11,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "AI Course Nigeria", "url": "https://www.dunamisedtech.com/courses/agentic-ai-nigeria" },
    { "@type": "ListItem", "position": 2, "name": "Cybersecurity Course Nigeria", "url": "https://www.dunamisedtech.com/courses/cybersecurity-nigeria" },
    { "@type": "ListItem", "position": 3, "name": "Cloud Computing Course Nigeria", "url": "https://www.dunamisedtech.com/courses/cloud-computing-nigeria" },
    { "@type": "ListItem", "position": 4, "name": "Full Stack Development Course Nigeria", "url": "https://www.dunamisedtech.com/courses/full-stack-nigeria" },
    { "@type": "ListItem", "position": 5, "name": "Data Engineering Course Nigeria", "url": "https://www.dunamisedtech.com/courses/data-engineering-nigeria" },
    { "@type": "ListItem", "position": 6, "name": "Mobile App Development Course Nigeria", "url": "https://www.dunamisedtech.com/courses/mobile-dev-nigeria" }
  ]
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
      
      <Navigation />
      <main>
        <CourseCatalog />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
