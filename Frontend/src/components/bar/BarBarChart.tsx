import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface VisitorData {
  hour: string;
  averageCount: number;
}

interface VisitorBarChartProps {
  barId: number; // รับ barId จาก parent
}

const VisitorBarChart: React.FC<VisitorBarChartProps> = ({ barId }) => {
  const [chartData, setChartData] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลโซนทั้งหมดใน Bar
        const zonesResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${barId}`
        );
        const zonesData = await zonesResponse.json();
        const zoneIds = zonesData.zones.map((zone: any) => zone.zone_id);

        // ดึงข้อมูล VisitorHistories
        const visitorsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/getAllVisitorHistories"
        );
        const visitorsData = await visitorsResponse.json();

        // กรองข้อมูลตาม zone_id และย้อนหลัง 30 วัน
        const now = new Date();
        const filteredVisitors = visitorsData.visitor_histories.filter(
          (history: any) => {
            const historyDate = new Date(history.date_time);
            const isWithin30Days =
              (now.getTime() - historyDate.getTime()) / (1000 * 60 * 60 * 24) <=
              30;
            return zoneIds.includes(history.zone_id) && isWithin30Days;
          }
        );

        // จัดกลุ่มข้อมูลตามชั่วโมง
        const hourlyData: Record<string, { total: number; count: number }> = {};

        filteredVisitors.forEach((history: any) => {
          const historyDate = new Date(history.date_time);
          const hour = historyDate.getHours(); // ดึงชั่วโมง (0-23)
          const hourLabel = `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`; // แปลงเป็น 12 ชั่วโมง (AM/PM)

          if (!hourlyData[hourLabel]) {
            hourlyData[hourLabel] = { total: 0, count: 0 };
          }

          hourlyData[hourLabel].total += history.visitor_count;
          hourlyData[hourLabel].count += 1;
        });

        // คำนวณค่าเฉลี่ยและแปลงเป็น Array
        const processedData = Object.entries(hourlyData).map(
          ([hour, data]) => ({
            hour,
            averageCount: data.total / data.count,
          })
        );

        // จัดเรียงข้อมูลตามลำดับเวลา
        processedData.sort((a, b) => {
          const hoursOrder = [
            "12 AM",
            "1 AM",
            "2 AM",
            "3 AM",
            "4 AM",
            "5 AM",
            "6 AM",
            "7 AM",
            "8 AM",
            "9 AM",
            "10 AM",
            "11 AM",
            "12 PM",
            "1 PM",
            "2 PM",
            "3 PM",
            "4 PM",
            "5 PM",
            "6 PM",
            "7 PM",
            "8 PM",
            "9 PM",
            "10 PM",
            "11 PM",
          ];
          return hoursOrder.indexOf(a.hour) - hoursOrder.indexOf(b.hour);
        });

        setChartData(processedData);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch visitor data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [barId]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="averageCount" fill="#FF6600" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VisitorBarChart;
