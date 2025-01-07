import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";

// Define types for the visitor history, chart data, and zone data
interface VisitorHistory {
  date_time: string;
  visitor_count: number;
  visitor_history_id: number;
  zone_id: number;
}

interface ChartData {
  name: string;
  value: number;
  hour: number; // Added hour field to represent the hour of the day
}

const TodayBarVisitorPieChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    setIsClient(true);

    // Fetch visitor history data
    fetch("http://127.0.0.1:8000/api/v1/getAllVisitorHistories")
      .then((response) => response.json())
      .then((data) => {
        const visitorHistories: VisitorHistory[] = data.visitor_histories;

        // Get the date 30 days ago
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Process the data for the last 30 days
        const filteredData: ChartData[] = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= thirtyDaysAgo && recordDate <= today) {
            const hour = recordDate.getHours(); // Extract the hour of the day
            const existingDataIndex = acc.findIndex((item) => item.hour === hour);

            if (existingDataIndex > -1) {
              acc[existingDataIndex].value += curr.visitor_count;
            } else {
              acc.push({
                name: `${hour}:00 - ${hour + 1}:00`, // Display the time range in the chart
                value: curr.visitor_count,
                hour,
              });
            }
          }
          return acc;
        }, []); // Filter data for the last 30 days

        // Calculate the average visitor count per hour
        const aggregatedData = filteredData.map((data) => {
          return {
            ...data,
            value: data.value / 30, // Divide by 30 to get the average per day for the last 30 days
          };
        });

        // Sort by hour
        aggregatedData.sort((a, b) => a.hour - b.hour);

        setChartData(aggregatedData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Ensure the chart is rendered only after the component has mounted on the client
  if (!isClient) return null;

  // Define an array of 24 different colors for the pie chart segments
  const COLORS = [
    "#33CC99", "#FF6347", "#FFD700", "#8A2BE2", "#7FFF00", "#D2691E", "#DC143C", "#FF4500", "#CC66FF", "#FF8C00",
    "#FF1493", "#00BFFF", "#7B68EE", "#32CD32", "#FF69B4", "#C71585", "#DB7093", "#FFFF00", "#20B2AA", "#B22222",
    "#FF00FF", "#9932CC", "#FF4500", "#8B4513"
  ];

  return (
    <div className="mt-8 text-center relative">
      <h3>Busiest Time from All Bar</h3>
      <h3>(Last 30 Days)</h3>
      <PieChart width={250} height={380}>
        <Pie
          data={chartData} // Use the calculated average data for the pie chart
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#33CC99"
          label={({ name }) => <Label value={name} fontSize={14} />} // Display label with custom font size
          labelLine={false} // Remove the label line that connects to the pie slices
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Apply different colors from the COLORS array
          ))}
        </Pie>
        <Tooltip itemStyle={{ fontSize: 12 }} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TodayBarVisitorPieChart;
