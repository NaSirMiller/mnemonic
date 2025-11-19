export interface Course {
  userId?: string;
  courseId?: string;
  courseName?: string;
  currentGrade?: number; // 0 to 1
  gradeTypes: Record<string, number>; // key is a category (i.e. exam), value is weight (0 to 1)
}
