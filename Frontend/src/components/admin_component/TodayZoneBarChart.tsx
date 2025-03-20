import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";

// Define types
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
  bar_id: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white py-2 px-4 rounded-lg text-sm">
        <div className="font-bold">{data.name}</div>
        <div className="flex justify-center gap-x-2">
          <div className="flex gap-x-1">
            <div className="text-green-400">Id : </div>
            {data.bar_id}
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

const TodayBarVisitorBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [visitorHistory, setVisitorHistory] = useState<VisitorHistory[]>([]);
  const [barNames, setBarNames] = useState<{ [key: number]: string }>({});
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
      const fetchBarNames = async () => {
        const barNameMap: { [key: number]: string } = {};

        await Promise.all(
          zones.map(async (zone) => {
            if (!barNameMap[zone.bar_id]) {
              try {
                const res = await fetch(
                  `http://127.0.0.1:8000/api/v1/getBarId/${zone.bar_id}`
                );
                const data = await res.json();
                barNameMap[zone.bar_id] = data.bar_name;
              } catch (error) {
                console.error("Error fetching bar name:", error);
              }
            }
          })
        );

        setBarNames(barNameMap);
      };

      fetchBarNames();
    }
  }, [zones]);

  // Fetch visitor history data (Zones)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/getAllZoneVisitorHistory")
      .then((response) => response.json())
      .then((data) => {
        setVisitorHistory(data.visitor_histories);
      })
      .catch((err) => console.error(err));
  }, []);

  const aggregateVisitorsByBar = () => {
    const aggregatedData: { [key: number]: number } = {};

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Aggregate Zone Visitors
    visitorHistory.forEach((history) => {
      const recordDate = new Date(history.date_time);
      if (recordDate >= startOfDay && recordDate <= endOfDay) {
        const zone = zones.find((z) => z.zone_id === history.zone_id);
        if (zone) {
          const barId = zone.bar_id;
          if (!aggregatedData[barId]) aggregatedData[barId] = 0;
          aggregatedData[barId] += history.visitor_count;
        }
      }
    });

    return Object.keys(aggregatedData).map((bar_id) => ({
      name: barNames[parseInt(bar_id)] || `Bar ${bar_id}`,
      value: aggregatedData[parseInt(bar_id)],
      bar_id: parseInt(bar_id),
    }));
  };

  if (!isClient) return null;

  return (
    <div className="text-center relative">
      <h3>Visitor Count in Zone (Today)</h3>
      <BarChart
        width={600}
        height={200}
        data={aggregateVisitorsByBar()}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bar_id" tick={{ fontSize: 14 }} />
        <YAxis tick={{ fontSize: 14 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Bar dataKey="value" fill="#33CC99" />
      </BarChart>
    </div>
  );
};

export default TodayBarVisitorBarChart;
