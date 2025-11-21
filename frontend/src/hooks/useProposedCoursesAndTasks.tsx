import { useState, useEffect, useCallback, useRef } from "react";
import { getProposedCourseInfo } from "../services/llmService";
import type { Course } from "../../../shared/models/course";
import type { Task } from "../../../shared/models/task";

export function useProposedCoursesAndTasks(document: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasCalledLLM = useRef(false);

  const loadProposedInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        course: fetchedCourses,
        tasks: fetchedTasks,
        error: llmError,
      } = await getProposedCourseInfo(document);

      if (llmError?.trim())
        console.error(
          `An error ocurred while trying to extract syllabus data: ${llmError}`
        );

      setCourse(fetchedCourses);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [document]);

  // Auto-fetch on mount / document change
  useEffect(() => {
    if (!hasCalledLLM.current && document) {
      loadProposedInfo();
      hasCalledLLM.current = true;
    }
  }, [document, loadProposedInfo]);

  // Expose a manual refresh function
  const refresh = useCallback(() => {
    loadProposedInfo();
  }, [loadProposedInfo]);

  return { isLoading, course, tasks, error, refresh };
}
