import { StudentDashboard } from '@/components/learning/StudentDashboard'

export const metadata = {
  title: 'My Dashboard | Dunamis EdTech',
  description: 'View your courses, progress, and learning stats'
}

export default function StudentDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <StudentDashboard />
    </div>
  )
}
