import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

        // Get the date 7 days ago
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Process the data for the last 7 days
        const filteredData: ChartData[] = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= sevenDaysAgo && recordDate <= today) {
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
        }, []);

        // Calculate the average visitor count per hour
        const aggregatedData = filteredData.map((data) => {
          return {
            ...data,
            value: data.value / 7, // Divide by 7 to get the average per day for the last 7 days
          };
        });

        setChartData(aggregatedData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Ensure the chart is rendered only after the component has mounted on the client
  if (!isClient) return null;

  return (
    <div className="mt-4 text-center relative">
      <h3>Busiest Time from All Bar  (Last 7 Days)</h3>
      <PieChart width={250} height={300}>
        <Pie
          data={chartData} // Use the calculated average data for the pie chart
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          fill="#33CC99"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#33CC99" : "#FF6347"} />
          ))}
        </Pie>
        <Tooltip itemStyle={{ fontSize: 12 }} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TodayBarVisitorPieChart;
