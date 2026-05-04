export const studentStore = {}

export const MOCK_DEPARTMENTS = []

export const MOCK_FACULTIES = []

export function getTokenLevelDisplay() {
  return { name: '', color: '' }
}

export function getProgressToNextLevel() {
  return 0
}

export function useStudentStore() {
  return {
    isOnboarded: false,
    fullName: '',
    studentId: '',
    currentTokens: 0,
    tokenLevel: 0,
    currentCgpa: 0,
    loginStreak: 0,
    totalLessonsCompleted: 0,
    enrolledCourses: [],
    todaySchedule: [],
    achievements: [],
    facultyId: '',
    departmentId: '',
    updateLoginStreak: () => {},
  }
}
