import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function formatHours(mins: number) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function TimeHistogram({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({ ...d, hours: d.minutes / 60 }));

  return (
    <BarChart width={650} height={350} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseName" />
      <YAxis tickFormatter={(val) => Math.round(val).toString()} />
      <Tooltip
        formatter={(val: number) => `${formatHours(val * 60)}`}
      />
      <Bar dataKey="hours" fill="#2F4872" name="" />
    </BarChart>
  );
}
