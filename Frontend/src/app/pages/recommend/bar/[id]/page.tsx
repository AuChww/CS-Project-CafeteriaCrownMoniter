"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import VisitorBarChart from "@/components/bar/BarBarChart";

interface Bar {
    bar_id: number;
    bar_name: string;
    bar_location: string;
    bar_detail: string;
    total_rating: number;
    total_reviews: number;
    bar_image: string;
}

interface Zone {
    zone_id: number;
    zone_name: string;
    zone_detail: string;
    current_visitor_count: number;
    max_people_in_zone: number;
    zone_time: string;
}

const BarPage = () => {
    const { id } = useParams();
    const [bar, setBar] = useState<Bar | null>(null);
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch Bar details
                const barResponse = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${id}`);
                if (!barResponse.ok) {
                    throw new Error("Failed to fetch bar details");
                }
                const barData = await barResponse.json();
                setBar(barData);

                // Fetch Zones in the Bar
                const zonesResponse = await fetch(`http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${id}`);
                if (!zonesResponse.ok) {
                    throw new Error("Failed to fetch zones");
                }
                const zonesData = await zonesResponse.json();
                setZones(zonesData.zones);

                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!bar) return <p>No bar details found.</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{bar.bar_name}</h1>
            <div className="grid gap-6">
                {bar.bar_image && (
                    <img
                        src={bar.bar_image}
                        alt={bar.bar_name}
                        className="w-full h-32 object-cover rounded-md mb-4"
                    />
                )}
                <p className="text-lg text-gray-700">
                    <strong>Location:</strong> {bar.bar_location}
                </p>
                <p className="text-lg text-gray-700">
                    <strong>Details:</strong> {bar.bar_detail}
                </p>
                <p className="text-lg text-gray-700">
                    <strong>Rating:</strong> {bar.total_rating} ({bar.total_reviews} reviews)
                </p>
            </div>

            {/* แสดง VisitorBarChart */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Visitor Count by Time</h2>
                <VisitorBarChart barId={parseInt(id as string)} />
            </div>

            {/* แสดงข้อมูล Zones */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Zones in this Bar</h2>
                <div className="grid grid-cols-1 gap-6">
                    {zones.map((zone) => (
                        <div
                            key={zone.zone_id}
                            className="p-4 border rounded-md shadow-sm bg-white"
                        >
                            <h3 className="text-lg font-bold">{zone.zone_name}</h3>
                            <p className="text-gray-700">{zone.zone_detail}</p>
                            <p className="text-gray-700">
                                <strong>Current Visitors:</strong> {zone.current_visitor_count}
                            </p>
                            <p className="text-gray-700">
                                <strong>Max Capacity:</strong> {zone.max_people_in_zone}
                            </p>
                            <p className="text-gray-700">
                                <strong>Operating Time:</strong> {zone.zone_time}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <iframe
                width="600"
                height="450"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.1268091151996!2d100.56791021146884!3d13.848421183966101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29cdd97ccda83%3A0x4a542530b310e9e9!2z4LmC4Lij4LiH4Lit4Liy4Lir4Liy4Lij4LiB4Lil4Liy4LiHIDEgKOC4muC4suC4o-C5jOC5g-C4q-C4oeC5iCk!5e0!3m2!1sth!2sth!4v1736263263951!5m2!1sth!2sth">
            </iframe>
        </div>
    );
};

export default BarPage;
