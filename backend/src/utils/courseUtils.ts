import { Course } from "../../../shared/models/course";
type ExpectedType = "string" | "number" | "undefined" | "null";

const CourseFieldTypes: Record<keyof Course, ExpectedType | ExpectedType[]> = {
  userId: ["string", "undefined"],
  courseId: ["string", "undefined"],
  courseName: ["string", "undefined"],
  currentGrade: ["number", "undefined"],
};

function getType(value: any): ExpectedType {
  if (value === null) return "null";
  return typeof value as ExpectedType;
}

export interface ValidationResult {
  isValid: boolean;
  firstError: string | null;
}

/**
 * Validates that each field in a Course object matches expected types.
 */
export function validateCourseTypes(course: Course): string[] {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(course)) {
    const field = key as keyof Course;
    const expected = CourseFieldTypes[field];

    if (!expected) {
      errors.push(`Unknown field "${field}" in Course.`);
      continue;
    }

    const expectedTypes = Array.isArray(expected) ? expected : [expected];
    const actualType = getType(value);

    if (!expectedTypes.includes(actualType)) {
      errors.push(
        `Invalid type for "${field}": expected ${expectedTypes.join(
          " | "
        )}, got ${actualType}`
      );
    }
  }

  return errors;
}

export function isCourseTypeValid(course: Course): ValidationResult {
  const errors = validateCourseTypes(course);
  if (errors.length > 0) {
    console.error("Error validating Course object:", errors[0]);
    return { isValid: false, firstError: errors[0] };
  }
  return { isValid: true, firstError: null };
}

/**
 * Check if immutable fields are being updated (e.g. userId or courseId).
 */
export function attemptsToUpdateImmutable(course: Course): boolean {
  return !!(course.userId || course.courseId);
}

/**
 * Check that required fields are present.
 */
export function hasRequiredFields(course: Course): boolean {
  if (!course.userId || typeof course.userId !== "string") return false;
  if (!course.courseName || typeof course.courseName !== "string") return false;
  return true;
}

/**
 * Apply defaults to optional fields, ensuring consistent structure.
 */
export function setCourseDefaults(course: Course): Course {
  return {
    userId: course.userId!,
    courseName: course.courseName!,
    currentGrade: course.currentGrade ?? 0,
  };
}

/**
 * Validate specific numeric fields in Course.
 *  - currentGrade: must be 0–1 if normalized
 */
export interface NumericFieldValidationResult {
  isValid: boolean;
  firstError?: string;
}

export function validateNumericCourseFieldValues(
  course: Course
): NumericFieldValidationResult {
  if (course.currentGrade !== undefined && course.currentGrade !== null) {
    if (!(course.currentGrade >= 0 && course.currentGrade <= 1)) {
      return {
        isValid: false,
        firstError: `Invalid currentGrade: ${course.currentGrade}. Must be 0–1.`,
      };
    }
  }

  return { isValid: true };
}
