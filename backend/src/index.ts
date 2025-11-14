import app from "./app";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

// import { TaskService } from "./services/llm";

// async function main() {
//   const service = new TaskService();

//   const start = performance.now();
//   const response = await service.generateTasks("Buy a home in Texas.");
//   console.log(`Response: ${response}`);
//   const end = performance.now();
//   console.log(`LLM took ${end - start} ms`);
// }

// main().catch((err) => {
//   console.error("Fatal error:", err);
//   process.exit(1);
// });
