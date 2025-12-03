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

export default function TimeTypeAveragesBar({
  data,
  showAverage,
}: {
  data: any[];
  showAverage: boolean;
}) {
  const chartData = data.map((d) => ({ ...d, hours: d.minutes / 60 }));

  return (
    <BarChart width={650} height={350} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="type" tick={ { fill: "#FFFFFF" } }/>
      <YAxis tickFormatter={(val) => Math.round(val).toString()} tick={ { fill: "#FFFFFF" } }/>
      <Tooltip
        formatter={(val: number) =>
          `${formatHours(val * 60)} ${showAverage ? "(avg)" : "(total)"}`
        }
        labelFormatter={(label) => `Time: ${label}`} // <-- add this
      />
      <Bar dataKey="hours" fill="#2F4872" name="Time" />
    </BarChart>
  );
}
