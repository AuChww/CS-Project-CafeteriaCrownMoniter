"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantCard from "@/components/RestaurantCard";

interface Zone {
    zone_id: number;
    zone_name: string;
    zone_detail: string;
    max_people_in_zone: number;
    current_visitor_count: number;
    update_date_time: string;
    zone_time: string;
}

interface Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_detail: string;
    restaurant_image: string;
    restaurant_location: string;
    total_rating: number;
    total_reviews: number;
    current_visitor_count: number;
    zone_id: number;
}

const ZonePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [zone, setZone] = useState<Zone | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchZoneAndRestaurants = async () => {
            try {
                setLoading(true);
        
                const [getZoneResponse, getRestaurantsResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/v1/getZoneById/${id}`),
                    fetch(`http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${id}`),
                ]);
        
                if (!getZoneResponse.ok || !getRestaurantsResponse.ok) {
                    throw new Error("Failed to fetch zone or restaurant data");
                }
        
                const zoneData: Zone = await getZoneResponse.json();
                const restaurantsData = await getRestaurantsResponse.json();
        
                // Access the restaurants array from the response object
                setRestaurants(restaurantsData.restaurants);
                setZone(zoneData);
                setError(null); // Clear previous errors
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        

        fetchZoneAndRestaurants();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!zone) return <p>Error fetching zone details.</p>;

    return (
        <div className="container mt-12 mx-auto p-4 w-full h-screen space-y-12">
            <div className="xl:grid grid-cols-2 gap-6 xl:pt-10">
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold mb-4 text-green-500">
                        {zone.zone_name}
                    </h1>
                    <p className="text-lg text-gray-700">{zone.zone_detail}</p>
                    <p className="text-lg text-gray-700">
                        <strong>Current Visitors:</strong> {zone.current_visitor_count} / {zone.max_people_in_zone}
                    </p>
                    <p className="text-lg text-gray-700">
                        <strong>Operating Hours:</strong> {zone.zone_time}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.restaurant_id}
                            onClick={() =>
                                router.push(`/pages/recommend/restaurant/${restaurant.restaurant_id}`)
                            }
                            className="cursor-pointer"
                        >
                            <RestaurantCard
                                restaurant_id={restaurant.restaurant_id}
                                restaurant_name={restaurant.restaurant_name}
                                restaurant_detail={restaurant.restaurant_detail}
                                restaurant_image={restaurant.restaurant_image}
                                restaurant_location={restaurant.restaurant_location}
                                total_rating={restaurant.total_rating}
                                current_visitor_count={restaurant.current_visitor_count}
                                total_reviews={restaurant.total_reviews}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ZonePage;
