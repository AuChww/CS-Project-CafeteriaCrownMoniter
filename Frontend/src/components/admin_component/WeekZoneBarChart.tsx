import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Define types for the visitor history and chart data
interface ZoneVisitorHistory {
  date_time: string;
  visitor_count: number;
  zone_visitor_history_id: number;
  zone_id: number;
}

interface ChartData {
  name: string;
  value: number;
  zone_id: number;
}

const WeekZoneVisitorBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure that this code runs only on the client
    setIsClient(true);

    // Fetch the data
    fetch("http://127.0.0.1:8000/api/v1/getAllZoneVisitorHistory")
      .then((response) => response.json())
      .then((data) => {
        const visitorHistories: ZoneVisitorHistory[] = data.visitor_histories;

        // Get today's date and calculate the date 7 days ago
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filter data for the last 7 days and process for the bar chart
        const filteredData: ChartData[] = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= sevenDaysAgo && recordDate <= today) {
            const zoneIndex = acc.findIndex((item) => item.zone_id === curr.zone_id);
            if (zoneIndex > -1) {
              acc[zoneIndex].value += curr.visitor_count;
            } else {
              acc.push({
                name: `Zone ${curr.zone_id}`,
                value: curr.visitor_count,
                zone_id: curr.zone_id,
              });
            }
          }
          return acc;
        }, []);

        setChartData(filteredData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Ensure the chart is rendered only after the component has mounted on the client
  if (!isClient) return null;

  return (
    <div className="text-center relative">
      <h3>Visitor Count by Zone (7 Days Before)</h3>
      <BarChart
        width={600}
        height={200}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 14 }}  // Set font size for X-axis labels
        />
        <YAxis 
          tick={{ fontSize: 14 }}  // Set font size for Y-axis labels
        />
        <Tooltip 
          itemStyle={{ fontSize: 14 }} // Set font size for tooltip items
        />
        <Legend 
          wrapperStyle={{ fontSize: 14 }}  // Set font size for the legend
        />
        <Bar dataKey="value" fill="#FF9900" />
      </BarChart>
    </div>
  );
};

export default WeekZoneVisitorBarChart;