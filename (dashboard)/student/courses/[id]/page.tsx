import { CoursePlayer } from '@/components/learning/CoursePlayer'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: 'Course Player | Dunamis EdTech',
    description: 'Continue learning your course'
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params

  // Fetch course data server-side
  const courseRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/${id}`,
    { cache: 'no-store' }
  ).catch(() => null)

  const course = courseRes?.ok ? await courseRes.json() : null

  if (!course) {
    return <div className="py-12 text-center">Course not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <CoursePlayer courseId={id} course={course} />
    </div>
  )
}
