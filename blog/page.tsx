import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createMetadata, organizationSchema, createBreadcrumbSchema } from "@/lib/seo-utils"
import { ArrowRight, Calendar, Clock, Search, User, BookOpen, TrendingUp, Plane, Code, ChevronRight } from "lucide-react"

export const metadata: Metadata = createMetadata({
  title: "Tech Blog Nigeria | AI, Coding, Cybersecurity Articles | Dunamis EdTech",
  description: "Read the latest articles on AI courses in Nigeria, how to learn coding fast, tech careers, and study abroad tips. Expert insights from Dunamis EdTech Lagos.",
  url: "https://www.dunamisedtech.com/blog"
})

// Blog collection schema for SEO
const blogCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Dunamis EdTech Blog",
  "description": "Expert articles on AI, coding, cybersecurity, and tech careers in Nigeria",
  "url": "https://www.dunamisedtech.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Dunamis EdTech",
    "url": "https://www.dunamisedtech.com"
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "https://www.dunamisedtech.com" },
  { name: "Blog", url: "https://www.dunamisedtech.com/blog" }
]);

const blogPosts = [
  {
    slug: "best-ai-courses-in-nigeria-2026",
    title: "Best AI Courses in Nigeria 2026: Complete Guide",
    excerpt: "Discover the top AI courses available in Nigeria for 2026. Compare prices, curriculum, job placement rates, and find the best AI training program.",
    author: "Dr. Emeka Okonkwo",
    date: "2026-01-15",
    readTime: "12 min read",
    category: "AI Courses",
    categoryIcon: TrendingUp,
    featured: true,
  },
  {
    slug: "how-to-learn-coding-fast-nigeria",
    title: "How to Learn Coding Fast in Nigeria: Complete 2026 Guide",
    excerpt: "Want to learn coding quickly in Nigeria? This guide covers the fastest paths to becoming a software developer, best coding bootcamps, and tips.",
    author: "Adaeze Nnamdi",
    date: "2026-01-10",
    readTime: "10 min read",
    category: "Coding",
    categoryIcon: Code,
    featured: true,
  },
  {
    slug: "how-to-make-money-with-ai-nigeria",
    title: "How to Make Money with AI in Nigeria: 10 Proven Ways",
    excerpt: "Learn practical ways to earn money using AI skills in Nigeria. From freelancing to building AI products, discover how to profit from AI.",
    author: "Tunde Bakare",
    date: "2026-01-05",
    readTime: "15 min read",
    category: "AI Business",
    categoryIcon: TrendingUp,
    featured: true,
  },
  {
    slug: "top-skills-to-learn-2026-nigeria",
    title: "Top 10 Skills to Learn in 2026 for High-Paying Jobs in Nigeria",
    excerpt: "Discover the most in-demand skills for 2026 that will land you high-paying jobs in Nigeria. From AI to cloud computing.",
    author: "Chioma Adebayo",
    date: "2026-01-01",
    readTime: "12 min read",
    category: "Career",
    categoryIcon: TrendingUp,
    featured: false,
  },
  {
    slug: "how-to-start-ai-career-nigeria-2024",
    title: "How to Start Your AI Career in Nigeria in 2024",
    excerpt: "A comprehensive guide to breaking into the AI industry in Nigeria. Learn the skills, certifications, and pathways to land your first AI job.",
    author: "Dr. Emeka Okonkwo",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "AI Careers",
    categoryIcon: TrendingUp,
    featured: false,
  },
  {
    slug: "top-10-highest-paying-tech-jobs-africa",
    title: "Top 10 Highest Paying Tech Jobs in Africa (2024)",
    excerpt: "Discover the most lucrative tech careers in Africa and what skills you need to land them. From AI engineers to cloud architects.",
    author: "Adaeze Nnamdi",
    date: "2024-03-12",
    readTime: "10 min read",
    category: "Tech Careers",
    categoryIcon: Code,
    featured: false,
  },
  {
    slug: "complete-guide-study-canada-nigeria",
    title: "Complete Guide to Studying in Canada from Nigeria",
    excerpt: "Everything you need to know about studying in Canada - from application to visa, scholarships, and settling in.",
    author: "Tunde Bakare",
    date: "2024-03-10",
    readTime: "15 min read",
    category: "Study Abroad",
    categoryIcon: Plane,
    featured: false,
  },
  {
    slug: "ijmb-vs-jupeb-which-better",
    title: "IJMB vs JUPEB: Which is Better for You?",
    excerpt: "A detailed comparison of IJMB and JUPEB programs to help you make the right choice for your university admission.",
    author: "Chioma Adebayo",
    date: "2024-03-08",
    readTime: "7 min read",
    category: "Education",
    categoryIcon: BookOpen,
    featured: false,
  },
  {
    slug: "ielts-band-7-tips-strategies",
    title: "How to Score Band 7+ in IELTS: Tips & Strategies",
    excerpt: "Proven strategies from our IELTS trainers to help you achieve your target band score. Includes practice techniques.",
    author: "Fatima Hassan",
    date: "2024-03-05",
    readTime: "12 min read",
    category: "IELTS",
    categoryIcon: BookOpen,
    featured: false,
  },
  {
    slug: "cybersecurity-career-path-beginners",
    title: "Cybersecurity Career Path for Beginners",
    excerpt: "Start your cybersecurity journey with this comprehensive guide covering certifications, skills, and job opportunities.",
    author: "Chioma Adebayo",
    date: "2024-03-01",
    readTime: "9 min read",
    category: "Cybersecurity",
    categoryIcon: Code,
    featured: false,
  },
  {
    slug: "prompt-engineering-future-of-work",
    title: "Prompt Engineering: The Future of Work",
    excerpt: "Why prompt engineering is becoming essential and how you can develop this skill to stay ahead in the AI age.",
    author: "Dr. Emeka Okonkwo",
    date: "2024-02-28",
    readTime: "6 min read",
    category: "AI",
    categoryIcon: TrendingUp,
    featured: false,
  },
  {
    slug: "cloud-computing-certifications-worth-it",
    title: "Are Cloud Computing Certifications Worth It?",
    excerpt: "An honest look at cloud certifications - which ones matter, ROI expectations, and how they impact your career.",
    author: "Oluwaseun Adeleke",
    date: "2024-02-25",
    readTime: "8 min read",
    category: "Cloud",
    categoryIcon: Code,
    featured: false,
  },
  {
    slug: "uk-scholarship-opportunities-nigerians",
    title: "UK Scholarship Opportunities for Nigerians in 2024",
    excerpt: "Comprehensive list of scholarships available for Nigerian students wanting to study in the United Kingdom.",
    author: "Tunde Bakare",
    date: "2024-02-22",
    readTime: "11 min read",
    category: "Study Abroad",
    categoryIcon: Plane,
    featured: false,
  },
]

const categories = [
  { name: "All Posts", count: blogPosts.length },
  { name: "AI Courses", count: 4 },
  { name: "Coding", count: 3 },
  { name: "Career", count: 5 },
  { name: "Study Abroad", count: 3 },
  { name: "Cybersecurity", count: 2 },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const recentPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Navigation />
      <main>
        {/* Breadcrumb */}
        <nav className="bg-muted/50 py-3" aria-label="Breadcrumb">
          <div className="container mx-auto px-4 lg:px-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-foreground font-medium" aria-current="page">Blog</li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
              <BookOpen className="mr-1 h-3 w-3" />
              Dunamis EdTech Blog
            </Badge>
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Insights & Resources
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
              Stay updated with the latest in AI, tech careers, study abroad tips, and educational guidance.
            </p>
            
            {/* Search */}
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg bg-primary-foreground/10 p-2">
              <Search className="ml-2 h-5 w-5 text-primary-foreground/60" />
              <Input 
                placeholder="Search articles..." 
                className="border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-0"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="bg-background py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground">Featured Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <Card key={post.slug} className="group border-border transition-all hover:border-accent/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <Badge variant="secondary" className="gap-1">
                        <post.categoryIcon className="h-3 w-3" />
                        {post.category}
                      </Badge>
                      <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-semibold text-card-foreground transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <h3 className="font-semibold text-foreground">Categories</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {categories.map((cat) => (
                        <li key={cat.name}>
                          <Link
                            href={cat.name === "All Posts" ? "/blog" : `/blog/category/${cat.name.toLowerCase().replace(" ", "-")}`}
                            className="flex items-center justify-between rounded-lg p-2 text-sm transition-colors hover:bg-accent/10 hover:text-accent"
                          >
                            <span>{cat.name}</span>
                            <Badge variant="secondary">{cat.count}</Badge>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </aside>

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Recent Articles</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {recentPosts.map((post) => (
                    <Card key={post.slug} className="group border-border transition-all hover:border-accent/50 hover:shadow-lg">
                      <CardHeader>
                        <Badge variant="secondary" className="mb-2 w-fit gap-1">
                          <post.categoryIcon className="h-3 w-3" />
                          {post.category}
                        </Badge>
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg font-semibold text-card-foreground transition-colors group-hover:text-accent">
                            {post.title}
                          </h3>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-primary-foreground/80">
              Get the latest articles, career tips, and exclusive offers delivered to your inbox.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 border-primary-foreground/20"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Subscribe
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
