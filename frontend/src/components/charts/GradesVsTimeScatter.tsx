import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// 1. Define expected clean data structure
type CleanDataPoint = {
  name: string;
  grade: number;
  timeCompleteness: number;
};

// 2. Component
export default function GradesVsTimeScatter({ data }: { data: any[] }) {
  // Normalize incoming data
  const cleanData: CleanDataPoint[] = (data || []).map((item) => {
    const taskName =
      item.name ||
      item.taskName ||
      item.taskname ||
      item.task_name ||
      item.title ||
      "Unknown Task";

    return {
      name: String(taskName), // ensure string
      grade: Number(item.grade) || 0,
      timeCompleteness: Number(item.timeCompleteness) || 0,
    };
  });

  if (!cleanData.length) return null;

  // Domain calculations
  const xValues = cleanData.map((d) => d.timeCompleteness);
  const yValues = cleanData.map((d) => d.grade);

  const xMin = Math.max(0, Math.floor(Math.min(...xValues) - 10));
  const xMax = Math.ceil(Math.max(...xValues) + 10);

  const yMin = Math.max(0, Math.floor(Math.min(...yValues) - 5));
  const yMax = Math.ceil(Math.max(...yValues) + 5);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const point = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div style={{ color: "#555", fontSize: "0.9em" }}>
            <span style={{ color: "#000" }}>{point.name}</span>
          </div>
          <div style={{ color: "#555", fontSize: "0.9em" }}>
            Grade : <span style={{ color: "#000" }}>{point.grade.toFixed(1)}%</span>
          </div>
          <div style={{ color: "#555", fontSize: "0.9em" }}>
            Time Completeness : <span style={{ color: "#000" }}>{point.timeCompleteness.toFixed(2)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ScatterChart
      width={650}   // fixed width
      height={350}  // fixed height
      margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
    >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      type="number"
      dataKey="timeCompleteness"
      name="Time Completeness"
      domain={[xMin, xMax]}
      label={{
        value: "Time Completeness (%)",
        position: "insideBottom",
        dy: 20,
      }}
      tick={ { fill: "#FFFFFF" } }
    />

    <YAxis
      type="number"
      dataKey="grade"
      name="Grade"
      domain={[yMin, yMax]}
      label={{
        value: "Grade (%)",
        angle: -90,
        dx: -20,
      }}
      tick={ { fill: "#FFFFFF" } }
    />

    {/* Pass the component itself, NOT JSX */}
    <Tooltip
      cursor={{ strokeDasharray: "3 3" }}
      content={CustomTooltip}
      isAnimationActive={false}
    />

    <Scatter
      name="Grades vs Time"
      data={cleanData}
      fill="#bec9c7"
      line={false}
      shape="circle"
    />
  </ScatterChart>
  );
}
