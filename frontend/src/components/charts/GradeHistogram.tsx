import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function GradeHistogram({ data }: { data: any[] }) {
  return (
    <BarChart width={650} height={350} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseName" tick={ { fill: "#FFFFFF" } }/>
      <YAxis domain={[0, 100]} tick={ { fill: "#FFFFFF" } }/>
      <Tooltip />
      <Bar dataKey="grade" fill="#2F4872"/>
    </BarChart>
  );
}
