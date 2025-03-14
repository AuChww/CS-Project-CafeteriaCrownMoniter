import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Define types for the visitor history, chart data, and zone data
interface ZoneVisitorHistory {
  date_time: string;
  visitor_count: number;
  zone_visitor_history_id: number;
  zone_id: number;
}

interface ChartData {
  name: string;
  value: number;
  hour: number;
}

const TodayBarVisitorPieChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[] | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/getAllZoneVisitorHistory")
      .then((response) => response.json())
      .then((data) => {
        const visitorHistories: ZoneVisitorHistory[] = data.visitor_histories;

        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Process the data for the last 30 days
        const filteredData: ChartData[] = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= thirtyDaysAgo && recordDate <= today) {
            const hour = recordDate.getHours();
            const existingDataIndex = acc.findIndex((item) => item.hour === hour);

            if (existingDataIndex > -1) {
              acc[existingDataIndex].value += curr.visitor_count;
            } else {
              acc.push({
                name: `${hour}:00 - ${hour + 1}:00`,
                value: curr.visitor_count,
                hour,
              });
            }
          }
          return acc;
        }, []);

        // Calculate the average visitor count per hour
        const aggregatedData = filteredData.map((data) => ({
          ...data,
          value: data.value / 30,
        }));

        // Sort by hour
        aggregatedData.sort((a, b) => a.hour - b.hour);

        setChartData(aggregatedData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Define colors for the pie chart
  const COLORS = [
    "#33CC99", "#FF6347", "#FFD700", "#8A2BE2", "#7FFF00", "#D2691E", "#DC143C", "#FF4500", "#CC66FF", "#FF8C00",
    "#FF1493", "#00BFFF", "#7B68EE", "#32CD32", "#FF69B4", "#C71585", "#DB7093", "#FFFF00", "#20B2AA", "#B22222",
    "#FF00FF", "#9932CC", "#FF4500", "#8B4513"
  ];

  // Show loading state before data is ready
  if (chartData === null) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="mt-8 text-center relative">
      <h3>Busiest Time from All Bar</h3>
      <h3>(Last 30 Days)</h3>
      <PieChart width={250} height={380}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          fill="#33CC99"
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip itemStyle={{ fontSize: 12 }} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TodayBarVisitorPieChart;
