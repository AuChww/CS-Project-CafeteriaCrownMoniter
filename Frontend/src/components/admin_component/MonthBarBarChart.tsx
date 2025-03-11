import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ZoneVisitorHistory {
  date_time: string;
  visitor_count: number;
  zone_visitor_history_id: number;
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

const MonthBarVisitorBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    Promise.all([
      fetch("http://127.0.0.1:8000/api/v1/getAllZoneVisitorHistory").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/v1/getAllZones").then((res) => res.json()),
    ])
      .then(([visitorData, zoneData]) => {
        if (!visitorData.zone_visitor_history_id || !Array.isArray(visitorData.visitor_histories)) return;
        if (!zoneData.zones || !Array.isArray(zoneData.zones)) return;

        setZones(zoneData.zones);

        const visitorHistories: ZoneVisitorHistory[] = visitorData.visitor_histories

        const filteredData = visitorHistories.reduce<ChartData[]>((acc, curr) => {
          const recordDate = new Date(curr.date_time);
          if (recordDate >= thirtyDaysAgo && recordDate <= today) {
            const zoneIndex = acc.findIndex((item) => item.bar_id === curr.zone_id);
            if (zoneIndex > -1) {
              acc[zoneIndex].value += curr.visitor_count;
            } else {
              acc.push({
                name: `Bar ${curr.zone_id}`,
                value: curr.visitor_count,
                bar_id: curr.zone_id,
              });
            }
          }
          return acc;
        }, []);

        setChartData(filteredData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // ฟังก์ชันรวมข้อมูลจาก Zone และ ChartData
  const aggregateVisitorsByBar = () => {
    const aggregatedData = chartData.reduce<{ [key: number]: number }>((acc, curr) => {
      const zone = zones.find((zone) => zone.zone_id === curr.bar_id);
      if (zone) {
        acc[zone.bar_id] = (acc[zone.bar_id] || 0) + curr.value;
      }
      return acc;
    }, {});

    return Object.keys(aggregatedData).map((bar_id) => ({
      name: `Bar ${bar_id}`,
      value: aggregatedData[parseInt(bar_id)],
      bar_id: parseInt(bar_id),
    }));
  };

  if (!isClient) return null;

  return (
    <div className="text-center relative">
      <h3>Visitor Count by Bar (30 Days Before)</h3>
      <BarChart
        width={600}
        height={200}
        data={aggregateVisitorsByBar()}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <YAxis tick={{ fontSize: 14 }} />
        <Tooltip itemStyle={{ fontSize: 14 }} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Bar dataKey="value" fill="#3366FF" />
      </BarChart>
    </div>
  );
};

export default MonthBarVisitorBarChart;
