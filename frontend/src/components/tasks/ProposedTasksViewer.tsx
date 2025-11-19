// import { useState, useEffect, useContext } from "react";

// import { sendFileAsHtml } from "../../services/llmService";
// import { FileInput } from "../file/FileInput";

// // const [currentSyllabus, setSyllabus] = useState<string | null>(null);

// const uploadFile = async (file: File) => {
//   const fileContent: Buffer = Buffer.from(await file.arrayBuffer());
//   const fileName: string = file.name;
//   const response = await sendFileAsHtml(fileContent, fileName);
//   const syllabusHtml: string = response.doc;
//   console.log(syllabusHtml);
//   // setSyllabus(syllabusHtml);
// };

// export function ProposedTasksViewer() {
//   return (
//     <div>
//       <FileInput onUpload={uploadFile} />
//     </div>
//   );
// }

// interface ProposedTaskViewerProps {
//   response?: {
//     course: Course;
//     tasks: Task[];
//   };
//   isProcessing?: boolean; // true while LLM is generating
//   onCoursesChanged?: () => void;
//   onTasksChanged?: () => void;
// }

// export function ProposedTaskViewer({
//   response,
//   isProcessing = false,
//   onCoursesChanged,
//   onTasksChanged,
// }: ProposedTaskViewerProps) {
//   const [activeTab, setActiveTab] = useState<"course" | "tasks">("course");

//   // --- Render progress bar if LLM is still processing ---
//   if (isProcessing || !response) {
//     return (
//       <div className="proposed-task-viewer-progress">
//         <div className="progress-label">LLM is generating proposals...</div>
//         <div className="progress-bar">
//           <div className="progress-bar-fill" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="proposed-task-viewer">
//       {/* Tabs */}
//       <div className="proposed-task-viewer-tabs">
//         <button
//           className={`tab-button ${activeTab === "course" ? "active" : ""}`}
//           onClick={() => setActiveTab("course")}
//         >
//           Course
//         </button>
//         <button
//           className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
//           onClick={() => setActiveTab("tasks")}
//         >
//           Tasks
//         </button>
//       </div>

//       {/* Tab content */}
//       <div className="proposed-task-viewer-tab-content">
//         {activeTab === "course" && (
//           <EditCourseWrapper
//             course={response.course}
//             onCoursesChanged={onCoursesChanged}
//           />
//         )}
//         {activeTab === "tasks" && (
//           <div className="tasks-list">
//             {response.tasks.map((task, i) => (
//               <EditTaskWrapper
//                 key={`proposed-task-${i}`}
//                 task={task}
//                 onTasksChanged={onTasksChanged}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ------------------------
// // Wrappers for prefilled forms
// // ------------------------

// interface EditCourseWrapperProps {
//   course: Course;
//   onCoursesChanged?: () => void;
// }

// function EditCourseWrapper({
//   course,
//   onCoursesChanged,
// }: EditCourseWrapperProps) {
//   // EditCourse expects state internally, so we prefill initial props using a wrapper
//   return (
//     <EditCoursePreFill
//       initialCourse={course}
//       onCoursesChanged={onCoursesChanged}
//     />
//   );
// }

// interface EditTaskWrapperProps {
//   task: Task;
//   onTasksChanged?: () => void;
// }

// function EditTaskWrapper({ task, onTasksChanged }: EditTaskWrapperProps) {
//   return <EditTaskPreFill initialTask={task} onTasksChanged={onTasksChanged} />;
// }

// // ------------------------
// // Prefill versions of EditCourse / EditTask
// // ------------------------

// // Minimal example, you can expand to fully replicate EditCourse/EditTask behavior
// interface EditCoursePreFillProps {
//   initialCourse: Course;
//   onCoursesChanged?: () => void;
// }

// function EditCoursePreFill({
//   initialCourse,
//   onCoursesChanged,
// }: EditCoursePreFillProps) {
//   return (
//     <EditCourse
//       onCoursesChanged={onCoursesChanged}
//       // You might want to pass initial state via props if EditCourse supports it
//       // Otherwise, you can extend EditCourse to accept `initialCourse`
//     />
//   );
// }

// interface EditTaskPreFillProps {
//   initialTask: Task;
//   onTasksChanged?: () => void;
// }

// function EditTaskPreFill({
//   initialTask,
//   onTasksChanged,
// }: EditTaskPreFillProps) {
//   return (
//     <EditTask
//       onTasksChanged={onTasksChanged}
//       // Similarly, pass initialTask if EditTask supports it
//     />
//   );
// }
