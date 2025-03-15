import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DeleteBar from "@/components/admin_component/bar_button/deleteBar";
import EditBar from "@/components/admin_component/bar_button/editBar";

interface CrowdCardProps {
    bar_id: number;
    bar_name: string;
    bar_location: string;
    max_people_in_bar: number;
    bar_image: string;
    bar_detail: string;
}

const AdminCrowdCard: React.FC<CrowdCardProps> = ({
    bar_id,
    bar_name,
    bar_location,
    max_people_in_bar,
    bar_image,
    bar_detail,
}) => {
    const router = useRouter();
    const [currentVisitors, setCurrentVisitors] = useState(0);

    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                // 1. ดึงข้อมูลโซนทั้งหมดที่เกี่ยวข้องกับ bar_id
                const zonesRes = await fetch(`http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${bar_id}`);
                const zonesData = await zonesRes.json();

                let totalZoneVisitors = (zonesData.zones || []).reduce(
                    (sum: number, zone: { current_visitor_count: number }) => sum + zone.current_visitor_count,
                    0
                );

                // 2. ดึงข้อมูลร้านอาหารทั้งหมดที่เกี่ยวข้องกับแต่ละ zone_id
                let totalRestaurantVisitors = 0;

                await Promise.all(
                    zonesData.zones.map(async (zone: { zone_id: number }) => {
                        const restaurantRes = await fetch(`http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${zone.zone_id}`);
                        const restaurantData = await restaurantRes.json();

                        // รวม current_visitor_count ของทุกร้านอาหารในโซนนั้น
                        totalRestaurantVisitors += (restaurantData.restaurants || []).reduce(
                            (sum: number, restaurant: { current_visitor_count?: number }) =>
                                sum + (restaurant.current_visitor_count || 0),
                            0
                        );
                    })
                );

                // 3. รวมค่า current_visitor ทั้งหมดจากโซนและร้านอาหาร
                setCurrentVisitors(totalZoneVisitors + totalRestaurantVisitors);
            } catch (error) {
                console.error("Error fetching visitor data:", error);
            }
        };

        fetchVisitorData();
    }, [bar_id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/deleteBar/${bar_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("ลบข้อมูลสำเร็จ");
                // รีเฟรชหน้าหรืออัพเดตข้อมูลใหม่
                router.push('/admin/dashboard');
            } else {
                alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            }
        } catch (error) {
            console.error("Error deleting bar:", error);
        }
    };


    return (
        <div
            className="bg-white hover:scale-110 duration-300  rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100"
        >
            <div onClick={() => router.push(`/pages/recommend/bar/${bar_id}`)}>
                <div className="h-full flex">
                    <img
                        className="rounded-t-lg w-1/2 h-full"
                        src={`/image/barImages/${bar_image}`}
                        alt="{bar_name}"
                    />
                    <a href="#">
                        <h5 className="ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                            {bar_name.length > 20 ? `${bar_name.slice(0, 20)}...` : bar_name}
                        </h5>

                    </a>
                </div>
                <div className="px-2 flex justify-between">
                    <div className="mt-2 flex space-x-1 ">
                        <svg
                            fill="#000000"
                            width="25px"
                            height="25px"
                            viewBox="-3 0 19 19"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cf-icon-svg"
                        >
                            <path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z" />
                        </svg>
                        <div
                            className={`text-md font-bold ${currentVisitors / max_people_in_bar < 0.5
                                ? 'text-green-400'
                                : currentVisitors / max_people_in_bar < 0.75
                                    ? 'text-yellow-400'
                                    : currentVisitors / max_people_in_bar < 1
                                        ? 'text-orange-500'
                                        : 'text-red-600'
                                }`}
                        >
                            {currentVisitors} / {max_people_in_bar}
                        </div>
                    </div>

                    {/* Bar Score */}
                    <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <svg
                                className="w-3 h-3 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                                className="w-3 h-3 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                                className="w-3 h-3 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                                className="w-3 h-3 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                                className="w-3 h-3 text-gray-200 dark:text-gray-600"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-2 mr-1">
                <EditBar />
                <DeleteBar onDelete={handleDelete} />
            </div>
        </div >
    );
};

export default AdminCrowdCard;
