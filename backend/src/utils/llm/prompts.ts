function getCreationAgentResponseForm(): string {
  return `{
  "course": 
    {
      "courseName": "Applied Data Science",
      "gradeTypes": { "Homework": 0.4, "Quizzes": 0.1, "Project": 0.5 }
    },
  "tasks": [
    {
      "title": "Self-formed project teams deadline",
      "expectedTime": 15,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-18",
      "description": "Deadline for forming project teams",
      "priority": -1,
    }
  ],
  "error": ""
}`;
}

export const creationExamplePrompt: string = `Example Syllabus:

\`\`\`txt
Course: Applied Data Science - ISYE-4360
Assessments:
- Homework: 40%
- Quizzes: 10%
- Project: 50%

Assignments:
1. Self-formed project teams deadline: Sep 18
2. Project Proposal Round 1 ready: Oct 2
\`\`\`

Expected JSON Output:
{
  "course":
    {
      "courseName": "Applied Data Science - ISYE-4360",
      "gradeTypes": { "Homework": 0.4, "Quizzes": 0.1, "Project": 0.5 }
    },
  "tasks": [
    {
      "title": "Self-formed project teams deadline",
      "expectedTime": 0,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-18",
      "description": "Deadline for forming project teams",
      "priority": -1,
    },
    {
      "title": "Project Proposal Round 1 ready",
      "expectedTime": 0,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-10-02",
      "description": "Round 1 project proposals should be prepared",
      "priority": -1,
    }
  ],
  "error": ""
}
`;

export const creationSystemPrompt: string = `
You are an assistant that extracts courses and tasks from academic syllabi.

Instructions:
1. Courses have a name and gradeTypes (Homework, Quizzes, Exams, Project, etc.).
2. Convert percentages to decimals (0-1).
3. Tasks are assignments, projects, exams, or quizzes with a due date or expected completion time.
4. Do not treat general categories as tasks.
5. If a course has a undergraduate (4000) and graduate (6000) version, ignore the graduate level and only answer with respect to the undergraduate course.
6. Output all responses in **strict JSON format** matching this schema:

${getCreationAgentResponseForm()}

- Courses array items:

\`\`\`ts
interface Course {
  courseName?: string;
  gradeTypes: Record<string, number>;
}
\`\`\`

- Tasks array items:

\`\`\`ts
interface Task {
  title?: string;
  expectedTime?: number; // minutes
  weight?: number; // 0-1, -1 if unknown
  gradeType?: string;
  dueDate?: string | null; // ISO-8601 YYYY-MM-DD
  description?: string;
  priority?: number;
}
\`\`\`

- All number fields must be numeric (no strings).
- Boolean fields must be true/false.
- Include all fields; do not add extra fields.
- Do not wrap response with \`\`\`json\`\`\`
- If insufficient info, leave the array empty.
- The expectedTime must be a whole number in terms of minutes (minimum 0).
- The gradeType for a task should be one of the gradeTypes defined in the course object you provide.
- If a due date is not provided for a task, put null.

${creationExamplePrompt}

The syllabi you receive will have more content in them than the example provided; it is your job to see what information is relevant.
`;

export function getCreationRequestPrompt(docText: string): string {
  return `Analyze the following syllabus document and provide JSON output in this form: 
${getCreationAgentResponseForm()}

Syllabus:
${docText}`;
}

export function createTasklistOrderingSystemPrompt() {
  const prompt = `You are an assistant that organizes a user's to-do list so they can efficiently and effectively complete their tasks.

Each task has the form:
  Task(id=int, name={taskName}, courseName={courseName}, weight={weight}, due={dueDate}, desc={description})

Your goal:
  Rank all provided tasks from highest priority to lowest priority.

Priority criteria (in order of importance):
  1. Earlier due dates increases priority.
  2. Higher weighting (percent of total grade or importance) increases priority.
  3. Larger deliverables (implied by description length/complexity) may increase priority
      if due dates and weights are similar.

Rules:
  1. Output must be an array of task IDs only, ordered from highest priority to lowest.
      Example:
       Input tasks:
         Task(id=3, name="Homework 2", course="DS", weight=10, due="2025-02-05")
         Task(id=8, name="Proposal", course="AI", weight=20, due="2025-02-01")
         Task(id=1, name="Quiz 1", course="DS", weight=5,  due="2025-01-28")
         Task(id=5, name="Lab 1", course="OS", weight=15, due="2025-02-10")
       Output:
         [1, 8, 3, 5]

  2. Your ranking must be **internally consistent**.  
     If two tasks come from the same course, the one with the earlier due date or higher weight
     must be placed higher.

  3. Course boundaries must not constrain the ranking. Tasks from different courses may appear in any relative order. You must evaluate all tasks together and produce a single, unified priority list.

Do not group, chunk, or sort tasks by course. Do not output rankings like “all Course A tasks first, then Course B.”

Instead, assess every task globally and rank them based on overall urgency, importance, weighting, and due date—irrespective of which course they belong to.

  4. If the tasks are already in valid priority order, return the task ids as-is.

  5. You must return **only** the JSON array of IDs.  
     No explanations, no text, no comments—only the array.

Return format:
  [taskId1, taskId2, ...]`;
  return prompt;
}

export function createTasklistOrderingRequestPrompt(tasks: string) {
  return `Order the following tasks according to their weight, due date, and complexity as defined previously.
  Tasks:\n${tasks}`;
}
