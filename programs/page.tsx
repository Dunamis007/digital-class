import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, BookOpen, FileCheck, GraduationCap, Globe, Plane, MapPin, Clock, Users, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Study Abroad & Educational Programs | Dunamis EdTech - IJMB, JUPEB, IELTS",
  description: "Gain university admission through IJMB, JUPEB, Cambridge A-Level. Study abroad in Canada, UK, USA, Europe with scholarship opportunities. IELTS preparation.",
  keywords: "IJMB Nigeria, JUPEB program, Cambridge A-Level Lagos, IELTS preparation Nigeria, study abroad Canada, UK university admission Nigeria",
}

const educationalPrograms = [
  {
    id: "ijmb",
    title: "IJMB Program",
    description: "Interim Joint Matriculation Board program for direct entry into 200 level of any Nigerian university without JAMB.",
    icon: BookOpen,
    duration: "9-12 months",
    price: "₦180,000",
    features: [
      "Direct Entry to 200 Level",
      "No JAMB Required",
      "All Nigerian Universities",
      "Science, Arts & Social Science",
      "Flexible Study Schedule"
    ],
    href: "/programs/ijmb",
  },
  {
    id: "jupeb",
    title: "JUPEB Program",
    description: "Joint Universities Preliminary Examinations Board for direct entry into Nigerian universities.",
    icon: FileCheck,
    duration: "9-12 months",
    price: "₦200,000",
    features: [
      "University Recognition",
      "Direct Entry Admission",
      "Science & Arts Subjects",
      "Flexible Classes",
      "Certificate Awarded"
    ],
    href: "/programs/jupeb",
  },
  {
    id: "cambridge",
    title: "Cambridge A-Level",
    description: "Internationally recognized qualification accepted by universities worldwide including UK, US, Canada.",
    icon: GraduationCap,
    duration: "18-24 months",
    price: "₦450,000",
    features: [
      "Global Recognition",
      "UK/US/Canada Universities",
      "Scholarship Eligible",
      "International Standards",
      "Expert Tutors"
    ],
    href: "/programs/cambridge",
  },
  {
    id: "ielts",
    title: "IELTS Preparation",
    description: "Comprehensive IELTS training for study abroad, immigration, and professional purposes.",
    icon: Globe,
    duration: "8-12 weeks",
    price: "₦120,000",
    features: [
      "Band 7+ Target",
      "All 4 Skills Covered",
      "Mock Tests Included",
      "Flexible Schedule",
      "Expert Trainers"
    ],
    href: "/programs/ielts",
  },
]

const studyAbroadDestinations = [
  {
    country: "Canada",
    flag: "🇨🇦",
    universities: 100,
    scholarships: "Up to 100%",
    intakes: "January, May, September",
    popular: ["University of Toronto", "UBC", "McGill", "Waterloo"],
    requirements: ["IELTS 6.0+", "Academic Transcripts", "Statement of Purpose"],
    href: "/programs/canada",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    universities: 150,
    scholarships: "Up to 75%",
    intakes: "September, January",
    popular: ["Oxford", "Cambridge", "Imperial College", "UCL"],
    requirements: ["IELTS 6.5+", "Academic Records", "References"],
    href: "/programs/uk",
  },
  {
    country: "United States",
    flag: "🇺🇸",
    universities: 200,
    scholarships: "Up to 100%",
    intakes: "Fall, Spring",
    popular: ["MIT", "Stanford", "Harvard", "Yale"],
    requirements: ["TOEFL/IELTS", "SAT/GRE", "Essays"],
    href: "/programs/usa",
  },
  {
    country: "Europe",
    flag: "🇪🇺",
    universities: 300,
    scholarships: "Tuition Free Options",
    intakes: "September, February",
    popular: ["Germany", "Netherlands", "France", "Sweden"],
    requirements: ["IELTS 6.0+", "Academic Records", "Motivation Letter"],
    href: "/programs/europe",
  },
]

const processSteps = [
  { step: 1, title: "Free Consultation", description: "Discuss your goals and get personalized guidance" },
  { step: 2, title: "Profile Evaluation", description: "We assess your eligibility and recommend best options" },
  { step: 3, title: "University Selection", description: "Choose from curated list of matching universities" },
  { step: 4, title: "Application Support", description: "Complete application with expert guidance" },
  { step: 5, title: "Visa Processing", description: "Full support for visa documentation and interview" },
  { step: 6, title: "Pre-Departure", description: "Accommodation, travel, and orientation briefing" },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
              <Plane className="mr-1 h-3 w-3" />
              Educational & Study Abroad Programs
            </Badge>
            <h1 className="mb-6 text-balance text-4xl font-bold text-primary-foreground md:text-5xl">
              Your Gateway to Global Education
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-primary-foreground/80">
              From IJMB and JUPEB for Nigerian university admission to study abroad programs in 
              Canada, UK, USA, and Europe. We guide you every step of the way.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="#programs">
                  Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                  Book Free Consultation
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Educational Programs */}
        <section id="programs" className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                <GraduationCap className="mr-1 h-3 w-3" />
                Nigerian University Admission
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Educational Programs
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Gain admission to Nigerian universities through alternative pathways without JAMB stress.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {educationalPrograms.map((program) => (
                <Card key={program.id} className="group border-border transition-all hover:border-accent/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-xl bg-secondary/50 p-3">
                      <program.icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-accent">
                      {program.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {program.duration}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <span className="text-lg font-bold text-foreground">{program.price}</span>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href={program.href}>
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Study Abroad */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                <Plane className="mr-1 h-3 w-3" />
                International Education
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Study Abroad Destinations
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Get admission and scholarships to top universities worldwide with our comprehensive support.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {studyAbroadDestinations.map((dest) => (
                <Card key={dest.country} className="group border-border transition-all hover:border-accent/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-4xl">{dest.flag}</span>
                        <h3 className="mt-2 text-2xl font-bold text-card-foreground group-hover:text-accent">
                          Study in {dest.country}
                        </h3>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">{dest.scholarships}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Universities</p>
                        <p className="font-semibold text-foreground">{dest.universities}+ Partner Schools</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Intakes</p>
                        <p className="font-semibold text-foreground">{dest.intakes}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">Popular Universities:</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.popular.map((uni) => (
                          <Badge key={uni} variant="secondary">{uni}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">Requirements:</p>
                      <ul className="space-y-1">
                        {dest.requirements.map((req) => (
                          <li key={req} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                      <Link href={dest.href}>
                        Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Our Simple Process
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                From consultation to your departure, we handle everything.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step.step} className="flex gap-4 rounded-xl border border-border bg-card p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
              Book a free consultation with our education advisors and take the first step towards your dream education.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                  Book Free Consultation
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
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
