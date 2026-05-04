import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { CoursePlayerEnhanced } from '@/components/learning/CoursePlayerEnhanced'
import { Skeleton } from '@/components/ui/skeleton'

interface CourseLearnPageProps {
  params: {
    'course-id': string
  }
  searchParams: {
    enrollment_id?: string
  }
}

async function getCourseData(courseId: string, enrollmentId?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // If no enrollment ID provided, redirect to dashboard to select enrollment
  if (!enrollmentId) {
    redirect('/dashboard/courses')
  }

  // Fetch course data
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (courseError || !course) {
    notFound()
  }

  // Verify enrollment exists and is valid
  const { data: enrollmentData, error: verifyError } = await supabase
    .from('trial_enrollments')
    .select('*, users(name)')
    .eq('id', enrollmentId)
    .eq('course_id', courseId)
    .single()

  if (verifyError || !enrollmentData) {
    notFound()
  }

  return {
    course: {
      id: course.id,
      title: course.title,
    },
    enrollment: {
      id: enrollmentData.id,
      studentName: (enrollmentData.users as { name: string } | null)?.name || 'Student',
    },
  }
}

export default async function CourseLearnPage({
  params,
  searchParams,
}: CourseLearnPageProps) {
  const courseId = params['course-id']

  try {
    const { course, enrollment } = await getCourseData(
      courseId,
      searchParams.enrollment_id
    )

    return (
      <div className="w-screen h-screen bg-background">
        <Suspense
          fallback={
            <div className="w-full h-full grid grid-cols-[320px_1fr]">
              <div className="border-r p-4 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          }
        >
          <CoursePlayerEnhanced
            enrollmentId={enrollment.id}
            courseId={courseId}
            courseName={course.title}
            studentName={enrollment.studentName}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('[CourseLearn] Error:', error)
    notFound()
  }
}

export const metadata = {
  title: 'Course Player | Learning',
  description: 'Your personalized learning experience',
}
