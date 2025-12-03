import { Course } from "../models/course";
import { Task } from "../models/task";

export interface CourseTasksCreationResponse {
  course: Course;
  tasks: Task[];
  error: string;
}
