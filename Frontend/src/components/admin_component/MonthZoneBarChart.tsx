import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, TooltipProps, CartesianGrid, Tooltip, Legend } from "recharts";

interface Zone {
  bar_id: number;
  zone_id: number;
  current_visitor_count: number;
  zone_name: string;
}

interface VisitorHistory {
  date_time: string;
  visitor_count: number;
  zone_id?: number; // Optional for restaurant data
  restaurant_id?: number;
}

interface ChartData {
  name: string;
  value: number;
  zone_id: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white py-2 px-4 rounded-lg text-sm">
        <div className="font-bold">{data.name}</div>
        <div className="flex justify-center gap-x-2">
          <div className="flex gap-x-1">
            <div className="text-green-400">Id : </div>
            {data.zone_id}
          </div>
          <div className="flex gap-x-1">
            <div className="ml-2 text-green-400">Visitors : </div>
            {data.value}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MonthZoneVisitorBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [visitorHistory, setVisitorHistory] = useState<VisitorHistory[]>([]);
  const [thirtyDaysAgoDate, setThirtyDaysAgoDate] = useState<Date | null>(null);

  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneNames, setZoneNames] = useState<{ [key: number]: string }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  
      fetch("http://127.0.0.1:8000/api/v1/getAllZones")
        .then((response) => response.json())
        .then((data) => {
          setZones(data.zones);
        })
        .catch((err) => console.error(err));
    }, []);
  

  useEffect(() => {
      if (zones.length > 0) {
        const fetchZoneNames = async () => {
          const zoneNameMap: { [key: number]: string } = {};
  
          await Promise.all(
            zones.map(async (zone) => {
              if (!zoneNameMap[zone.zone_id]) {
                try {
                  const res = await fetch(`http://127.0.0.1:8000/api/v1/getZoneById/${zone.zone_id}`);
                  const data = await res.json();
                  zoneNameMap[zone.zone_id] = data.zone_name;
                } catch (error) {
                  console.error("Error fetching bar name:", error);
                }
              }
            })
          );
  
          setZoneNames(zoneNameMap);
        };
  
        fetchZoneNames();
      }
    }, [zones]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/getAllZoneVisitorHistory")
      .then((response) => response.json())
      .then((data) => setVisitorHistory(data.visitor_histories))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 days ago
    setThirtyDaysAgoDate(thirtyDaysAgo);
  }, []);

  useEffect(() => {
    if (
      visitorHistory.length === 0 ||
      !thirtyDaysAgoDate ||
      Object.keys(zoneNames).length === 0 // Check if barNames is populated
    ) {
      return; // Skip processing until barNames is populated
    }
  
    const dailyVisitorMap: { [date: string]: { [barId: number]: number[] } } = {};
  
    visitorHistory.forEach((history) => {
      const recordDate = new Date(history.date_time);
      if (recordDate >= thirtyDaysAgoDate) {
        const dateKey = recordDate.toISOString().split("T")[0];
        const zone_id = history.zone_id!;
  
        if (!dailyVisitorMap[dateKey]) {
          dailyVisitorMap[dateKey] = {};
        }
        if (!dailyVisitorMap[dateKey][zone_id]) {
          dailyVisitorMap[dateKey][zone_id] = [];
        }
        dailyVisitorMap[dateKey][zone_id].push(history.visitor_count);
      }
    });
  
    const aggregatedData: { [zone_id: number]: { total: number; days: number } } = {};
  
    Object.values(dailyVisitorMap).forEach((dayData) => {
      Object.entries(dayData).forEach(([zone_id, counts]) => {
        const id = parseInt(zone_id);
        if (!aggregatedData[id]) {
          aggregatedData[id] = { total: 0, days: 0 };
        }
        aggregatedData[id].total += counts.reduce((sum, count) => sum + count, 0) / counts.length;
        aggregatedData[id].days += 1;
      });
    });
  
    const finalChartData = Object.entries(aggregatedData).map(([zone_id, data]) => ({
      name: zoneNames[parseInt(zone_id)], // Now guaranteed to have the bar name
      value: data.total / data.days,
      zone_id: parseInt(zone_id),
    }));
  
    setChartData(finalChartData);
  }, [visitorHistory, thirtyDaysAgoDate, zoneNames]);
  

  if (!thirtyDaysAgoDate) return null; // Wait until thirtyDaysAgoDate is set

  return (
    <div className="text-center relative">
      <h3>Average Visitors in Zone (Last 30 Days)</h3>
      <BarChart width={600} height={200} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="zone_id" tick={{ fontSize: 14 }} />
        <YAxis tick={{ fontSize: 14 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Bar dataKey="value" fill="#3366FF" />
      </BarChart>
    </div>
  );
};

export default MonthZoneVisitorBarChart;
