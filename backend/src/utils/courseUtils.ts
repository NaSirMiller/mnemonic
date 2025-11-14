import { Course } from "../../../shared/models/course";
type ExpectedType = "string" | "number" | "undefined" | "null" | "object";

const CourseFieldTypes: Record<keyof Course, ExpectedType | ExpectedType[]> = {
  userId: ["string", "undefined"],
  courseId: ["string", "undefined"],
  courseName: ["string", "undefined"],
  currentGrade: ["number", "undefined"],
  gradeTypes: ["object", "undefined"],
};

function getType(value: any): ExpectedType {
  if (value === null) return "null";
  if (typeof value === "object" && !Array.isArray(value)) return "object";
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
    if (field === "gradeTypes" && value) {
        for (const [k, v] of Object.entries(value)) {
          if (typeof v !== "number") {
            errors.push(`gradeTypes.${k} must be a number`);
        }
      }
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
export function attemptsToUpdateImmutable(coursePayload: any) {
  return coursePayload.courseId != null; // only block if courseId is being changed
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
    gradeTypes: course.gradeTypes ?? {}, // default empty object
    courseId: course.courseId,
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
  if (course.gradeTypes) {
    for (const [key, value] of Object.entries(course.gradeTypes)) {
      if (typeof value !== "number" || value < 0 || value > 1) {
        return {
          isValid: false,
          firstError: `Invalid gradeTypes value for "${key}": ${value}. Must be 0–1.`,
        };
      }
    }
  }

  return { isValid: true };
}
