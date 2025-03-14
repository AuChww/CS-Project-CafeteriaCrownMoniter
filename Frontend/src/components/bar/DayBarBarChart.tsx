import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns"; // For handling date formatting

interface VisitorHistory {
    date_time: string;
    visitor_count: number;
    visitor_history_id: number;
    zone_id: number;
}

const DayOfWeekVisitorChart = () => {
    const [visitorData, setVisitorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/v1/getAllVisitorHistories");
                if (!response.ok) {
                    throw new Error("Failed to fetch visitor data");
                }
                const data = await response.json();
                const visitorHistories: VisitorHistory[] = data.visitor_histories;

                // Group visitor count by the day of the week
                const dayOfWeekCounts = visitorHistories.reduce((acc: any, curr) => {
                    const date = new Date(curr.date_time);
                    const dayOfWeek = format(date, "EEEE"); // Get the full name of the day (e.g., Monday)
                    acc[dayOfWeek] = acc[dayOfWeek] || 0;
                    acc[dayOfWeek] += curr.visitor_count;
                    return acc;
                }, {});

                // Convert to an array of data for the chart
                const chartData = Object.keys(dayOfWeekCounts).map((day) => ({
                    day: day,
                    visitor_count: dayOfWeekCounts[day],
                }));

                // Ensure the data is sorted by day of the week
                const daysOfWeek = [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ];
                const sortedData = daysOfWeek.map((day) => {
                    return chartData.find((item) => item.day === day) || { day, visitor_count: 0 };
                });

                setVisitorData(sortedData);
                setError(null); // Clear any previous errors
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVisitorData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
                <XAxis
                    dataKey="day"
                    tick={{
                        fontSize: 12,
                        fontFamily: "inherit",
                        fill: "#616161",
                    }}
                />
                <YAxis
                    tick={{
                        fontSize: 12,
                        fontFamily: "inherit",
                        fill: "#616161",
                    }}
                />
                <Tooltip />
                <Bar dataKey="visitor_count" fill="#3366FF" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DayOfWeekVisitorChart;
