function getCreationAgentResponseForm() {
  return `{
  "course": 
    {
      "courseName": "Applied Data Science",
      "gradeTypes": { "Homework": 0.4, "Quizzes": 0.1, "Project": 0.5 }
    },
  "tasks": [
    {
      "title": "Self-formed project teams deadline",
      "courseName": "Applied Data Science",
      "currentTime": 0,
      "expectedTime": 0,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-18",
      "description": "Deadline for forming project teams",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
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
      "courseName": "Applied Data Science - ISYE-4360",
      "currentTime": 0,
      "expectedTime": 0,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-18",
      "description": "Deadline for forming project teams",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Project Proposal Round 1 ready",
      "courseName": "Applied Data Science - ISYE-4360",
      "currentTime": 0,
      "expectedTime": 0,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-10-02",
      "description": "Round 1 project proposals should be prepared",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    }
  ],
  "error": ""
}
`;

export const creationSystemPrompt: string = `
You are an assistant that extracts courses and tasks from academic syllabi.
You will receive a syllabus document in HTML format.

Instructions:
1. Courses have a name and gradeTypes (Homework, Quizzes, Exams, Project, etc.).
2. Convert percentages to decimals (0-1).
3. Tasks are assignments, projects, exams, or quizzes with a due date or expected completion time.
4. Do not treat general categories as tasks.
5. Output all responses in **strict JSON format** matching this schema:

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
  courseName?: string;
  currentTime?: number; // minutes
  expectedTime?: number; // minutes
  weight?: number; // 0-1, -1 if unknown
  gradeType?: string;
  dueDate?: string | null; // ISO-8601 YYYY-MM-DD
  description?: string;
  grade?: number;
  priority?: number;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
  isComplete?: boolean;
}
\`\`\`

- All number fields must be numeric (no strings).
- Boolean fields must be true/false.
- Include all fields; do not add extra fields.
- Do not wrap response with \`\`\`json\`\`\`
- If insufficient info, leave the array empty.
- The currentTime field must be 0.
- The expectedTime field must be 0, unless you have an int estimate (in minutes)

${creationExamplePrompt}. The syllabi you receive will have more content in them than the example provided, it is your job to see what information is relevant.
`;

export function getCreationRequestPrompt(docText: string): string {
  return `Analyze the following syllabus document and provide JSON output in this form:
${getCreationAgentResponseForm()}

Syllabus:
${docText}`;
}

// const orderTasksSystemPrompt: string = `You are an assistant that orders tasks based on grade weighting, due date, and its description.
// You will receive a list of tasks in the following format:
//   id=1:Task(name="Complete HW 2", weight=.07, due="2025-11-28T04:59:00.000Z", desc="Has 4 parts.")

// Instructions:
// 1. Tasks `;
// const orderTasksRequestPrompt: string = ``;
