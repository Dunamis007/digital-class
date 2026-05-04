import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { 
  ArrowRight, 
  MapPin, 
  Star, 
  Users, 
  Clock, 
  CheckCircle,
  Phone,
  Mail,
  Sparkles,
  Shield,
  Cloud,
  Code
} from "lucide-react"

const locations: Record<string, {
  name: string
  state: string
  description: string
  highlights: string[]
  studentCount: number
  address: string
  phone: string
  email: string
  courses: { title: string; icon: React.ElementType; students: number; href: string }[]
}> = {
  "lagos": {
    name: "Lagos",
    state: "Lagos State",
    description: "Our flagship campus in Lagos, the commercial capital of Nigeria. Home to our largest student community and state-of-the-art facilities.",
    highlights: [
      "Main campus with dedicated learning spaces",
      "Hybrid learning options (online + in-person)",
      "Regular networking events and meetups",
      "Direct access to Lagos tech ecosystem",
      "Partnerships with leading tech companies"
    ],
    studentCount: 3500,
    address: "123 Tech Hub Road, Victoria Island, Lagos",
    phone: "+234 800 000 0001",
    email: "lagos@dunamisedtech.com",
    courses: [
      { title: "Agentic AI & GenAI", icon: Sparkles, students: 450, href: "/courses/agentic-ai" },
      { title: "Cybersecurity", icon: Shield, students: 320, href: "/courses/cybersecurity" },
      { title: "Cloud Computing", icon: Cloud, students: 380, href: "/courses/cloud-computing" },
      { title: "Full Stack Development", icon: Code, students: 520, href: "/courses/full-stack" },
    ]
  },
  "abuja": {
    name: "Abuja",
    state: "FCT",
    description: "Our Abuja center serves the Federal Capital Territory and surrounding states, offering premium tech education in the heart of Nigeria.",
    highlights: [
      "Central Abuja location",
      "Weekend and evening classes available",
      "Government sector partnerships",
      "Growing community of tech professionals",
      "Study abroad counseling center"
    ],
    studentCount: 1200,
    address: "45 Innovation Drive, Wuse 2, Abuja",
    phone: "+234 800 000 0002",
    email: "abuja@dunamisedtech.com",
    courses: [
      { title: "Agentic AI & GenAI", icon: Sparkles, students: 180, href: "/courses/agentic-ai" },
      { title: "Cybersecurity", icon: Shield, students: 150, href: "/courses/cybersecurity" },
      { title: "Cloud Computing", icon: Cloud, students: 200, href: "/courses/cloud-computing" },
      { title: "Data Analysis", icon: Code, students: 280, href: "/courses/data-analysis" },
    ]
  },
  "port-harcourt": {
    name: "Port Harcourt",
    state: "Rivers State",
    description: "Serving the South-South region with quality tech education. Our Port Harcourt center is growing rapidly with the oil & gas sector's digital transformation.",
    highlights: [
      "South-South hub for tech education",
      "Oil & gas industry partnerships",
      "Flexible learning schedules",
      "Local job placement support",
      "Community of industry professionals"
    ],
    studentCount: 800,
    address: "78 Tech Avenue, GRA Phase 2, Port Harcourt",
    phone: "+234 800 000 0003",
    email: "ph@dunamisedtech.com",
    courses: [
      { title: "Cloud Computing", icon: Cloud, students: 120, href: "/courses/cloud-computing" },
      { title: "Cybersecurity", icon: Shield, students: 100, href: "/courses/cybersecurity" },
      { title: "Data Engineering", icon: Code, students: 90, href: "/courses/data-engineering" },
      { title: "Full Stack Development", icon: Code, students: 150, href: "/courses/full-stack" },
    ]
  }
}

type PageProps = {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const location = locations[city]
  
  if (!location) {
    return { title: "Location Not Found | Dunamis EdTech" }
  }
  
  return {
    title: `Tech & AI Courses in ${location.name} | Dunamis EdTech Training Center`,
    description: `Learn AI, Cybersecurity, Cloud Computing & more in ${location.name}. ${location.studentCount.toLocaleString()}+ students. Industry-led training with 87% job placement. Enroll today!`,
    keywords: `tech courses ${location.name}, AI training ${location.name}, cybersecurity course ${location.name}, cloud computing ${location.name}, coding bootcamp ${location.name}, tech training Nigeria`,
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params
  const location = locations[city]
  
  if (!location) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
                <MapPin className="mr-1 h-3 w-3" />
                {location.state}
              </Badge>
              
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                Tech & AI Training in {location.name}
              </h1>
              
              <p className="mb-6 text-lg text-primary-foreground/80">
                {location.description}
              </p>

              <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/70">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <strong className="text-primary-foreground">{location.studentCount.toLocaleString()}+</strong> Students
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  <strong className="text-primary-foreground">4.9/5</strong> Rating
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Flexible Schedules
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/courses">
                    View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href={`https://wa.me/2348000000000?text=Hi!%20I%27m%20interested%20in%20courses%20in%20${location.name}`} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="bg-background py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
              Popular Courses in {location.name}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {location.courses.map((course) => (
                <Card key={course.title} className="group border-border transition-all hover:border-accent/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3">
                      <course.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground group-hover:text-accent">
                      {course.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <Users className="mr-1 inline h-4 w-4" />
                      {course.students} students in {location.name}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href={course.href}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Location */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                  Why Learn With Us in {location.name}
                </h2>
                <ul className="space-y-4">
                  {location.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-foreground">Visit Our {location.name} Center</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <a href={`tel:${location.phone}`} className="text-muted-foreground hover:text-accent">
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent" />
                    <a href={`mailto:${location.email}`} className="text-muted-foreground hover:text-accent">
                      {location.email}
                    </a>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                      Schedule a Visit
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
              Start Your Tech Career in {location.name}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
              Join {location.studentCount.toLocaleString()}+ students who are transforming their careers with Dunamis EdTech.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/signup">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(locations).map((city) => ({ city }))
}
