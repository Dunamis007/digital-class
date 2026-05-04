import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { createMetadata, organizationSchema } from "@/lib/seo-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  GraduationCap,
  FileText,
  Users,
  Award,
  BookOpen,
  Calendar
} from "lucide-react"

const programs: Record<string, {
  title: string
  subtitle: string
  description: string
  longDescription: string
  duration: string
  price: string
  category: string
  features: string[]
  curriculum: { title: string; topics: string[] }[]
  requirements: string[]
  benefits: string[]
  faqs: { question: string; answer: string }[]
}> = {
  "ijmb": {
    title: "IJMB Program",
    subtitle: "Direct Entry to 200 Level Without JAMB",
    description: "Interim Joint Matriculation Board program for direct entry admission into 200 level of any Nigerian university.",
    longDescription: "The IJMB (Interim Joint Matriculation Board) programme is an advanced level programme that prepares students for direct entry admission into 200 level of any Nigerian university. This programme is recognized by all Nigerian universities and offers an alternative pathway to higher education without the need for JAMB.",
    duration: "9-12 months",
    price: "₦180,000",
    category: "Educational",
    features: [
      "Direct Entry to 200 Level",
      "No JAMB Required",
      "Accepted by All Nigerian Universities",
      "Science, Arts & Commercial Subjects",
      "Flexible Study Schedule",
      "Experienced Tutors",
      "Tutorial Support",
      "Exam Preparation"
    ],
    curriculum: [
      { title: "Sciences", topics: ["Mathematics", "Physics", "Chemistry", "Biology", "Agricultural Science"] },
      { title: "Arts", topics: ["Literature", "Government", "History", "CRS/IRS", "Geography"] },
      { title: "Commercial", topics: ["Accounting", "Economics", "Commerce", "Business Studies"] },
    ],
    requirements: [
      "O&apos;Level certificate (WAEC/NECO) with minimum 5 credits",
      "Must include English and Mathematics",
      "Age: 16 years and above",
      "Passport photographs",
      "Valid ID card"
    ],
    benefits: [
      "Skip 100 level entirely",
      "Graduate a year earlier than JAMB students",
      "Avoid JAMB exam stress",
      "Study any course of your choice",
      "Gain admission to any university in Nigeria"
    ],
    faqs: [
      { question: "Can I study medicine with IJMB?", answer: "Yes, you can study any course including Medicine, Law, Engineering through IJMB direct entry." },
      { question: "Is IJMB certificate recognized?", answer: "Yes, IJMB is fully recognized by all Nigerian universities and the National Universities Commission (NUC)." },
      { question: "What is the pass mark for IJMB?", answer: "You need a minimum of 8 points across 3 subjects to qualify for university admission." },
    ]
  },
  "jupeb": {
    title: "JUPEB Program",
    subtitle: "Joint Universities Preliminary Examinations Board",
    description: "University-recognized program for direct entry admission into Nigerian universities.",
    longDescription: "JUPEB (Joint Universities Preliminary Examinations Board) is an advanced level examination conducted by Nigerian universities for students seeking direct entry admission into 200 level. It is affiliated with specific universities that conduct the examinations.",
    duration: "9-12 months",
    price: "₦200,000",
    category: "Educational",
    features: [
      "University Recognition",
      "Direct Entry Admission",
      "Affiliated Universities",
      "Science & Arts Subjects",
      "Quality Tutoring",
      "Regular Assessment",
      "Certificate Awarded",
      "Career Guidance"
    ],
    curriculum: [
      { title: "Sciences", topics: ["Mathematics", "Physics", "Chemistry", "Biology"] },
      { title: "Arts & Social Sciences", topics: ["Literature", "Government", "Economics", "Geography", "History"] },
      { title: "Use of English", topics: ["Grammar", "Comprehension", "Essay Writing", "Summary"] },
    ],
    requirements: [
      "O&apos;Level certificate with minimum 5 credits",
      "Credits must include English Language",
      "Minimum age of 16 years",
      "Completed application form",
      "Passport photographs"
    ],
    benefits: [
      "Direct entry to 200 level",
      "Recognized by JAMB for DE",
      "Study at affiliated universities",
      "Quality education standards",
      "Certificate from recognized board"
    ],
    faqs: [
      { question: "Which universities accept JUPEB?", answer: "Many Nigerian universities accept JUPEB including UNILAG, UI, OAU, UNIBEN, and many more." },
      { question: "Can I change course after JUPEB?", answer: "Yes, you can apply for any course as long as you have the required subject combination and points." },
      { question: "How many points do I need?", answer: "Most universities require a minimum of 10 points for competitive courses like Medicine and Law." },
    ]
  },
  "cambridge": {
    title: "Cambridge A-Level",
    subtitle: "Internationally Recognized Qualification",
    description: "World-class qualification accepted by universities in UK, US, Canada, Australia and worldwide.",
    longDescription: "Cambridge A-Level is an internationally recognized qualification that prepares students for university admission worldwide. This rigorous academic program develops critical thinking, research skills, and deep subject knowledge valued by top universities globally.",
    duration: "18-24 months",
    price: "₦450,000",
    category: "International",
    features: [
      "Global Recognition",
      "UK/US/Canada Universities",
      "Scholarship Eligible",
      "International Standards",
      "Expert Cambridge Tutors",
      "Mock Examinations",
      "University Counseling",
      "Study Abroad Support"
    ],
    curriculum: [
      { title: "Sciences", topics: ["Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology"] },
      { title: "Humanities", topics: ["English Literature", "History", "Geography", "Psychology", "Sociology"] },
      { title: "Business", topics: ["Economics", "Business Studies", "Accounting", "Law"] },
    ],
    requirements: [
      "Strong O&apos;Level/IGCSE results (minimum 5 Bs)",
      "Good command of English",
      "Commitment to 18-24 months study",
      "Academic references",
      "Personal statement"
    ],
    benefits: [
      "Accepted by all UK universities",
      "Entry to US, Canadian, Australian universities",
      "Scholarship opportunities worldwide",
      "Develops critical thinking skills",
      "International curriculum standards"
    ],
    faqs: [
      { question: "How many A-Level subjects do I need?", answer: "Most universities require 3 A-Level subjects. Some competitive courses may ask for 4." },
      { question: "Can I study A-Level alongside work?", answer: "Yes, we offer flexible schedules including evening and weekend classes." },
      { question: "Do UK universities accept A-Level from Nigeria?", answer: "Yes, Cambridge A-Level is the same qualification worldwide and is fully recognized." },
    ]
  },
  "ielts": {
    title: "IELTS Preparation",
    subtitle: "Achieve Your Target Band Score",
    description: "Comprehensive IELTS training for study abroad, immigration, and professional purposes.",
    longDescription: "Our IELTS preparation course is designed to help you achieve your target band score. Whether you need IELTS for university admission, immigration, or professional registration, our experienced trainers will guide you through all four components of the test.",
    duration: "8-12 weeks",
    price: "₦120,000",
    category: "Test Prep",
    features: [
      "All 4 Skills Covered",
      "Band 7+ Target",
      "Mock Tests Weekly",
      "Individual Feedback",
      "Speaking Practice",
      "Writing Corrections",
      "Exam Strategies",
      "Flexible Schedule"
    ],
    curriculum: [
      { title: "Listening", topics: ["Note-taking", "Multiple Choice", "Matching", "Map/Diagram Labeling"] },
      { title: "Reading", topics: ["Skimming & Scanning", "True/False/Not Given", "Matching Headings", "Summary Completion"] },
      { title: "Writing", topics: ["Task 1: Reports/Letters", "Task 2: Essays", "Grammar for Writing", "Cohesion & Coherence"] },
      { title: "Speaking", topics: ["Part 1: Introduction", "Part 2: Long Turn", "Part 3: Discussion", "Fluency & Pronunciation"] },
    ],
    requirements: [
      "Basic English proficiency",
      "Commitment to daily practice",
      "Access to study materials",
      "Laptop/smartphone for online resources"
    ],
    benefits: [
      "Achieve target band score",
      "Expert British Council trained teachers",
      "Regular mock tests",
      "Personalized feedback",
      "Exam booking support"
    ],
    faqs: [
      { question: "What band score do I need for Canada?", answer: "Most Canadian universities require IELTS 6.5 overall with no band below 6.0." },
      { question: "How long should I prepare?", answer: "We recommend 8-12 weeks of intensive preparation for best results." },
      { question: "Do you help with exam registration?", answer: "Yes, we guide you through the registration process and exam booking." },
    ]
  },
  "canada": {
    title: "Study in Canada",
    subtitle: "Your Path to Canadian Education",
    description: "Comprehensive support for studying at top Canadian universities with scholarship opportunities.",
    longDescription: "Canada is one of the most popular study destinations for Nigerian students, offering world-class education, post-study work opportunities, and a pathway to permanent residency. Our team provides end-to-end support from university selection to visa processing.",
    duration: "Application cycle: 3-6 months",
    price: "₦350,000",
    category: "Study Abroad",
    features: [
      "100+ Partner Universities",
      "Scholarship Applications",
      "SOP & LOR Review",
      "Visa Documentation",
      "Interview Preparation",
      "Pre-departure Briefing",
      "Accommodation Support",
      "Post-arrival Support"
    ],
    curriculum: [
      { title: "Undergraduate Programs", topics: ["Bachelor&apos;s Degrees", "Associate Degrees", "Diploma Programs", "Certificate Courses"] },
      { title: "Graduate Programs", topics: ["Master&apos;s Degrees", "PhD Programs", "Professional Degrees", "Graduate Certificates"] },
      { title: "Pathway Programs", topics: ["Foundation Year", "Pre-Master&apos;s", "English Preparation", "College Transfer"] },
    ],
    requirements: [
      "Academic transcripts",
      "IELTS 6.0+ (minimum 5.5 for pathways)",
      "Valid international passport",
      "Statement of Purpose",
      "Letters of Recommendation",
      "Proof of funds"
    ],
    benefits: [
      "Post-graduation work permit (up to 3 years)",
      "Pathway to permanent residency",
      "High quality education",
      "Multicultural environment",
      "Part-time work while studying"
    ],
    faqs: [
      { question: "What are the intakes in Canada?", answer: "Canadian universities have 3 intakes: Fall (September), Winter (January), and Summer (May)." },
      { question: "Can I work while studying?", answer: "Yes, international students can work up to 20 hours per week during studies and full-time during breaks." },
      { question: "What is the cost of living in Canada?", answer: "Budget approximately CAD 15,000-20,000 per year for living expenses outside tuition." },
    ]
  },
  "uk": {
    title: "Study in UK",
    subtitle: "World-Class British Education",
    description: "Access prestigious UK universities with our comprehensive application support and guidance.",
    longDescription: "The UK is home to some of the world&apos;s most prestigious universities including Oxford, Cambridge, and Imperial College. Our team helps Nigerian students navigate the UCAS system and secure admission to top UK institutions.",
    duration: "Application cycle: 3-6 months",
    price: "₦300,000",
    category: "Study Abroad",
    features: [
      "150+ UK Universities",
      "UCAS Application Support",
      "Scholarship Guidance",
      "Personal Statement Review",
      "Visa Documentation",
      "CAS Guidance",
      "Pre-departure Support",
      "Alumni Network"
    ],
    curriculum: [
      { title: "Undergraduate", topics: ["Bachelor&apos;s Degrees (3 years)", "Foundation Courses", "Integrated Masters"] },
      { title: "Postgraduate", topics: ["Master&apos;s (1 year)", "MBA Programs", "PhD Research", "Professional Courses"] },
      { title: "Pathways", topics: ["International Foundation", "Pre-sessional English", "Graduate Diploma"] },
    ],
    requirements: [
      "A-Level or equivalent",
      "IELTS 6.5+ (varies by course)",
      "Academic transcripts",
      "Personal statement",
      "References",
      "Proof of funds"
    ],
    benefits: [
      "Shorter degree programs",
      "Graduate visa (2 years post-study)",
      "World-renowned qualifications",
      "Research opportunities",
      "Cultural experience"
    ],
    faqs: [
      { question: "How long is a Master&apos;s in UK?", answer: "Most taught Master&apos;s programs in the UK are 1 year, making them very cost-effective." },
      { question: "What is UCAS?", answer: "UCAS is the centralized application system for UK undergraduate programs." },
      { question: "Can I stay after graduation?", answer: "Yes, the Graduate Route visa allows you to stay and work for 2 years after graduating." },
    ]
  },
  "usa": {
    title: "Study in USA",
    subtitle: "American Dream Education",
    description: "Access to top American universities with comprehensive application and visa support.",
    longDescription: "The United States offers unparalleled educational opportunities with flexible curriculum, cutting-edge research, and diverse campus experiences. From Ivy League to state universities, we help you find the perfect fit.",
    duration: "Application cycle: 4-8 months",
    price: "₦400,000",
    category: "Study Abroad",
    features: [
      "200+ Partner Universities",
      "Common App Support",
      "SAT/GRE Preparation",
      "Scholarship Search",
      "Essay Review",
      "Interview Prep",
      "Visa Training",
      "Campus Connect"
    ],
    curriculum: [
      { title: "Undergraduate", topics: ["Bachelor&apos;s Degrees (4 years)", "Associate Degrees", "Liberal Arts"] },
      { title: "Graduate", topics: ["Master&apos;s Programs", "PhD Programs", "Professional Schools", "MBA"] },
      { title: "Community College", topics: ["Transfer Programs", "Certificate Courses", "Pathway to University"] },
    ],
    requirements: [
      "High school diploma/Bachelor&apos;s",
      "SAT/ACT (undergrad) or GRE/GMAT (graduate)",
      "TOEFL/IELTS scores",
      "Essays/Personal statements",
      "Letters of recommendation",
      "Financial documentation"
    ],
    benefits: [
      "Flexible curriculum",
      "OPT work authorization",
      "Diverse community",
      "Research opportunities",
      "Career services"
    ],
    faqs: [
      { question: "Do I need SAT for US universities?", answer: "Many universities are now test-optional, but top schools still prefer SAT/ACT scores." },
      { question: "What is OPT?", answer: "Optional Practical Training allows international students to work in the US for 1-3 years after graduation." },
      { question: "Are scholarships available?", answer: "Yes, many US universities offer merit and need-based scholarships to international students." },
    ]
  },
  "europe": {
    title: "Study in Europe",
    subtitle: "Quality Education, Affordable Options",
    description: "Discover tuition-free and low-cost study options across European countries.",
    longDescription: "Europe offers incredible value for international students, with many countries offering tuition-free education or very affordable programs. From Germany to Netherlands, we help you explore diverse options across the continent.",
    duration: "Application cycle: 3-6 months",
    price: "₦280,000",
    category: "Study Abroad",
    features: [
      "Tuition-free Options",
      "300+ Universities",
      "Multiple Countries",
      "English-taught Programs",
      "Scholarship Support",
      "Visa Guidance",
      "Blocked Account Help",
      "Accommodation Support"
    ],
    curriculum: [
      { title: "Germany", topics: ["Free Tuition", "Strong Engineering", "Research Focus", "Blocked Account Required"] },
      { title: "Netherlands", topics: ["English Programs", "Innovation Hub", "Scholarship Options", "Post-study Work"] },
      { title: "Other Countries", topics: ["France", "Sweden", "Poland", "Ireland", "Finland"] },
    ],
    requirements: [
      "Bachelor&apos;s/High school certificate",
      "English proficiency (IELTS 6.0+)",
      "Blocked account (Germany)",
      "Motivation letter",
      "CV/Resume",
      "Academic transcripts"
    ],
    benefits: [
      "Affordable/Free tuition",
      "High quality education",
      "Schengen travel",
      "Post-study work options",
      "Multicultural experience"
    ],
    faqs: [
      { question: "Is education really free in Germany?", answer: "Yes, public universities in Germany charge no tuition for most programs, only a small semester fee." },
      { question: "What is a blocked account?", answer: "A blocked account is required for German student visa, showing you have ~€11,000 for living expenses." },
      { question: "Can I study in English in Europe?", answer: "Yes, many European universities offer programs fully taught in English." },
    ]
  },
}

type PageProps = {
  params: Promise<{ slug: string }>
}

const programMetadataMap: Record<string, { title: string; description: string }> = {
  "ijmb": {
    title: "IJMB Programme in Lagos | Direct Entry to 200 Level Without JAMB | Dunamis EdTech",
    description: "Enrol for IJMB in Ikorodu Lagos. Direct entry to 200 level at any Nigerian university without JAMB. All subjects available. Apply now. From ₦180,000."
  },
  "jupeb": {
    title: "JUPEB Programme in Lagos | University Entrance Examination | Dunamis EdTech",
    description: "JUPEB (Joint Universities Preliminary Examinations Board) programme in Lagos. Alternative to A-Levels. University entrance exam prep. Dunamis EdTech. From ₦170,000."
  },
  "cambridge": {
    title: "Cambridge A-Level in Lagos | CAIE Qualifications | Dunamis EdTech",
    description: "Cambridge A-Level training in Lagos (Ikorodu). UK-recognised qualifications. University entrance in UK, Canada, Australia. From ₦250,000. Dunamis EdTech Lagos."
  },
  "ielts": {
    title: "IELTS Exam Preparation in Lagos | Band 7+ Guarantee | Dunamis EdTech",
    description: "IELTS preparation course in Ikorodu Lagos with band guarantee. Speaking, writing, listening and reading. Study abroad certification. From ₦120,000."
  },
  "canada": {
    title: "Study in Canada Programme | Visa & University Application | Dunamis EdTech",
    description: "Study abroad programme to Canada from Nigeria. University applications, visa guidance, IELTS prep. Dunamis EdTech Lagos. Comprehensive support."
  },
  "uk": {
    title: "Study in UK Programme | Oxford & Cambridge Pathway | Dunamis EdTech",
    description: "Study abroad to UK from Nigeria. University applications, Cambridge A-Level prep, visa support. Top UK universities. Dunamis EdTech Lagos."
  },
  "usa": {
    title: "Study in USA Programme | SAT & University Admission | Dunamis EdTech",
    description: "Study in USA from Nigeria. SAT prep, university applications, visa guidance. Dunamis EdTech, Lagos. Pathway to American universities."
  },
  "europe": {
    title: "Study in Europe Programme | Germany, Netherlands & More | Dunamis EdTech",
    description: "Study abroad in Europe from Nigeria. Germany, Netherlands, France pathways. University applications, visa support. Dunamis EdTech Lagos."
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const program = programs[slug]
  const metadata = programMetadataMap[slug]
  
  if (!program || !metadata) {
    return { title: "Program Not Found | Dunamis EdTech" }
  }
  
  return createMetadata({
    title: metadata.title,
    description: metadata.description,
    url: `https://www.dunamisedtech.com/programs/${slug}`
  })
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params
  const program = programs[slug]
  
  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Badge variant="secondary" className="mb-4">{program.category}</Badge>
                <h1 className="mb-2 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                  {program.title}
                </h1>
                <p className="mb-4 text-xl text-accent">{program.subtitle}</p>
                <p className="mb-6 text-lg text-primary-foreground/80">{program.longDescription}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-primary-foreground/70">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" /> {program.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" /> {program.category}
                  </span>
                </div>
              </div>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{program.price}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href={`/apply/${slug}`}>
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="border-t pt-4">
                  <h4 className="mb-4 font-semibold">Program includes:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {program.features.slice(0, 6).map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-12 lg:col-span-2">
                {/* Features */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">What&apos;s Included</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 rounded-lg border border-border p-4">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Curriculum / Subjects</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {program.curriculum.map((section) => (
                      <Card key={section.title}>
                        <CardHeader>
                          <h3 className="font-semibold text-foreground">{section.title}</h3>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.topics.map((topic) => (
                              <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4 text-accent" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Requirements</h2>
                  <ul className="space-y-3">
                    {program.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Benefits</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3 rounded-lg bg-accent/10 p-4">
                        <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {program.faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="mb-2 font-semibold text-foreground">{faq.question}</h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="sticky top-20 bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-accent" />
                    <h3 className="mb-2 text-xl font-semibold">Need Help Deciding?</h3>
                    <p className="mb-4 text-primary-foreground/80">
                      Speak with our education advisors for free consultation.
                    </p>
                    <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                        Book Free Consultation
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-foreground">Important Dates</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium text-foreground">Next Intake</p>
                          <p className="text-sm text-muted-foreground">Applications Open</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium text-foreground">Duration</p>
                          <p className="text-sm text-muted-foreground">{program.duration}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

export async function generateStaticParams() {
  return Object.keys(programs).map((slug) => ({ slug }))
}
