import { Course } from "../models/course";
import { Task } from "../models/task";

export interface CourseTasksCreationResponse {
  courses: Course[];
  tasks: Task[];
}
