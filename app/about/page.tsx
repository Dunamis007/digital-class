import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { createMetadata, organizationSchema } from "@/lib/seo-utils"
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Globe,
  CheckCircle2,
  Share2,
  Mail
} from "lucide-react"

export const metadata: Metadata = createMetadata({
  title: "About Dunamis EdTech | AI & Tech Training Institute in Lagos Nigeria",
  description: "Discover Dunamis EdTech's mission, vision & values. The #1 AI & digital skills training institute in Ikorodu Lagos serving thousands of students across Nigeria.",
  url: "https://www.dunamisedtech.com/about"
})

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We deliver world-class education that meets international standards and prepares students for global careers.",
  },
  {
    icon: Heart,
    title: "Impact",
    description: "Every course and program is designed to create measurable impact in our students' careers and lives.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster a supportive learning community where students collaborate, network, and grow together.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Quality education should be accessible to all. We offer flexible payment plans and scholarships.",
  },
]

const milestones = [
  { year: "2019", title: "Founded", description: "Dunamis EdTech was established with a vision to transform tech education in Africa." },
  { year: "2020", title: "First 1,000 Students", description: "Reached our first milestone of 1,000 enrolled students across Nigeria." },
  { year: "2021", title: "Study Abroad Launch", description: "Expanded to offer comprehensive study abroad programs to Canada, UK, and Europe." },
  { year: "2022", title: "AI Programs Introduced", description: "Became one of the first institutes in Nigeria to offer specialized AI/ML courses." },
  { year: "2023", title: "10,000+ Graduates", description: "Celebrated over 10,000 successful graduates with 87% job placement rate." },
  { year: "2024", title: "Agentic AI Pioneer", description: "Launched Africa's first comprehensive Agentic AI & GenAI certification program." },
]

const team = [
  {
    name: "Dr. Adebayo Ogunlesi",
    role: "Founder & CEO",
    bio: "Former Google AI researcher with 15+ years in tech education.",
    image: "/team/ceo.jpg",
  },
  {
    name: "Engr. Chioma Nwosu",
    role: "Head of Academics",
    bio: "Cybersecurity expert and former Microsoft Nigeria Lead.",
    image: "/team/academics.jpg",
  },
  {
    name: "Mr. Emeka Obi",
    role: "Director, Study Abroad",
    bio: "Immigration consultant with partnerships across 50+ universities.",
    image: "/team/study-abroad.jpg",
  },
  {
    name: "Mrs. Fatima Hassan",
    role: "Head of Student Success",
    bio: "Career coach who has helped 5,000+ students land tech jobs.",
    image: "/team/success.jpg",
  },
]

const partners = [
  "AWS", "Microsoft", "Google Cloud", "Meta", "Coursera", "edX", "British Council", "IDP Education"
]

export default function AboutPage() {
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
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold md:text-5xl">
                Transforming African Talent Through Tech Education
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/80">
                Dunamis EdTech is on a mission to bridge the tech skills gap in Africa by providing world-class, industry-relevant training that prepares students for global opportunities.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                <div>
                  <p className="text-4xl font-bold text-accent">10,000+</p>
                  <p className="text-sm text-primary-foreground/70">Graduates</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-accent">87%</p>
                  <p className="text-sm text-primary-foreground/70">Job Placement</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-accent">50+</p>
                  <p className="text-sm text-primary-foreground/70">Expert Instructors</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-accent">5</p>
                  <p className="text-sm text-primary-foreground/70">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                  To empower African youth with cutting-edge digital skills and global education opportunities, enabling them to compete and excel in the global tech economy while contributing to Africa&apos;s technological advancement.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <Eye className="h-6 w-6 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground">
                  To become Africa&apos;s leading tech education and study abroad institute, recognized globally for producing world-class tech talent and facilitating seamless international education pathways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-border bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Our Core Values</h2>
              <p className="mt-4 text-muted-foreground">
                These principles guide everything we do at Dunamis EdTech.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="rounded-lg border border-border bg-background p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <p className="mt-4 text-muted-foreground">
                From a small training center to Africa&apos;s leading EdTech platform.
              </p>
            </div>
            <div className="mt-12">
              <div className="relative mx-auto max-w-3xl">
                <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-border" />
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative mb-8 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 rounded-lg border border-border bg-background p-4 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <span className="text-sm font-bold text-accent">{milestone.year}</span>
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-accent bg-background" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-y border-border bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Leadership Team</h2>
              <p className="mt-4 text-muted-foreground">
                Meet the experts driving our mission forward.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <div key={index} className="rounded-lg border border-border bg-background p-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-accent">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Our Partners</h2>
              <p className="mt-4 text-muted-foreground">
                We collaborate with leading tech companies and educational institutions worldwide.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="flex h-16 w-32 items-center justify-center rounded-lg border border-border bg-muted/50 px-4">
                  <span className="font-semibold text-muted-foreground">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of students who have transformed their careers with Dunamis EdTech.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
