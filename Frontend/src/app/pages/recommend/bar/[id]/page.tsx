"use client";

import { useParams } from "next/navigation";  // ใช้ useParams แทน useRouter
import React, { useEffect, useState } from "react";

interface Bar {
    bar_id: number;
    bar_name: string;
    bar_location: string;
    bar_detail: string;
    total_rating: number;
    total_reviews: number;
    bar_image: string;
}

const BarPage = () => {
    const { id } = useParams();  // ดึง id จาก URL
    console.log(id);
    const [bar, setBar] = useState<Bar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return; // รอให้ id โหลดเสร็จก่อน

        const fetchBar = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bar details");
                }

                const data = await response.json();
                console.log(data); // Log the response to verify its structure

                if (data) {  // Check directly if the data exists
                    setBar(data);  // Set the bar data directly from the response
                } else {
                    setError("Bar details not found.");
                }
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBar();
    }, [id]);  // รอให้ id เปลี่ยนแปลงแล้วเรียกใหม่


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
        </div>
    );
};

export default BarPage;
