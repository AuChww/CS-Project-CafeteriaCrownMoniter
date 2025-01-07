import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Define types for the visitor history, chart data, and zone data
interface VisitorHistory {
  date_time: string;
  visitor_count: number;
  visitor_history_id: number;
  zone_id: number;
}

interface Zone {
  bar_id: number;
  zone_id: number;
  current_visitor_count: number;
  zone_name: string;
}

interface ChartData {
  name: string;
  value: number;
  bar_id: number;
}

const WeekBarVisitorBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    setIsClient(true);

    // Fetch visitor history data
    fetch("http://127.0.0.1:8000/api/v1/getAllVisitorHistories")
      .then((response) => response.json())
      .then((data) => {
        const visitorHistories: VisitorHistory[] = data.visitor_histories;

        // Get today's date and calculate the date 7 days ago
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filter data for the last 7 days and process for the bar chart
        const filteredData: ChartData[] = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= sevenDaysAgo && recordDate <= today) {
            const zoneIndex = acc.findIndex((item) => item.bar_id === curr.zone_id); // Use bar_id instead of zone_id
            if (zoneIndex > -1) {
              acc[zoneIndex].value += curr.visitor_count;
            } else {
              acc.push({
                name: `Bar ${curr.zone_id}`, // Display bar name here
                value: curr.visitor_count,
                bar_id: curr.zone_id, // Assuming zone_id represents bar_id
              });
            }
          }
          return acc;
        }, []);

        setChartData(filteredData);
      })
      .catch((err) => console.error(err));

    // Fetch zones data
    fetch("http://127.0.0.1:8000/api/v1/getAllZones")
      .then((response) => response.json())
      .then((data) => {
        setZones(data.zones);
      })
      .catch((err) => console.error(err));
  }, []);

  // Combine the visitor history with zone data (aggregating visitor counts by bar_id)
  const aggregateVisitorsByBar = () => {
    const aggregatedData: { [key: number]: number } = {};

    // Sum the visitor count for each zone in the bar
    chartData.forEach((data) => {
      const zone = zones.find((zone) => zone.zone_id === data.bar_id);
      if (zone) {
        if (!aggregatedData[zone.bar_id]) {
          aggregatedData[zone.bar_id] = 0;
        }
        aggregatedData[zone.bar_id] += zone.current_visitor_count;
      }
    });

    return Object.keys(aggregatedData).map((bar_id) => ({
      name: `Bar ${bar_id}`,
      value: aggregatedData[parseInt(bar_id)],
      bar_id: parseInt(bar_id),
    }));
  };

  // Ensure the chart is rendered only after the component has mounted on the client
  if (!isClient) return null;

  return (
    <div className="text-center relative">
      <h3>Visitor Count by Bar (Last 7 Days)</h3>
      <BarChart
        width={600}
        height={200}
        data={aggregateVisitorsByBar()} // Use the aggregated data here
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

export default WeekBarVisitorBarChart;
