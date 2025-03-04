import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdOutlineRestaurant } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import ZoneVisitorBarChart from "./WeekZoneBarChart";
import TodayZoneVisitorBarChart from "./TodayZoneBarChart";
import BarVisitorBarChart from "./WeekBarBarChart";
import TodayBarVisitorBarChart from "./TodayBarBarChart";
import TodayBarVisitorPieChart from "./MonthBarPieChart";
import WeekZoneVisitorBarChart from "./WeekZoneBarChart";
import WeekBarVisitorBarChart from "./WeekBarBarChart";
import MonthBarVisitorBarChart from "./MonthBarBarChart";
import MonthZoneVisitorBarChart from "./MonthZoneBarChart";


const AdminSwipe = () => {
    const router = useRouter();

    useEffect(() => {
        // Automatically trigger the "Next" button every 3 seconds
        const interval = setInterval(() => {
            const nextButton = document.querySelector("[data-carousel-next]") as HTMLElement;
            if (nextButton) {
                nextButton.click();
            }
        }, 3000);

        // Cleanup interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex gap-x-1">
            <div className="w-1/6 mt-4 h-full gap-1">
                <div className="w-full mb-1">
                    <div onClick={() => router.push("/pages/recommend/bar/topBar")} className="h-full duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col">
                        <div className="flex mt-1">
                            <BiSolidLike className="w-8 h-8" />
                            <MdOutlineRestaurant className="w-8 h-8" />
                        </div>
                        <span>Top Bar & Restaurant 2025</span>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-y-1">
                    <div onClick={() => router.push("/pages/recommend/bar/allBar/")} className="h-1/2 duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col">
                        <div>
                            <FaWarehouse className="w-8 h-8 mt-1" />
                        </div>
                        <span>All Bar</span>
                    </div>

                    <div onClick={() => router.push("/pages/recommend/restaurant/")} className="h-1/2 duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col text-center">
                        <div>
                            <MdOutlineRestaurant className="w-8 h-8 mt-1" />
                        </div>
                        <span>All Restaurant</span>
                    </div>
                </div>
                <TodayBarVisitorPieChart />
            </div>
            <div className="relative">
                <div className="flex">
                    <TodayZoneVisitorBarChart />
                    <TodayBarVisitorBarChart />
                </div>
                <div className="flex">
                    <WeekZoneVisitorBarChart />
                    <WeekBarVisitorBarChart />
                </div>
                <div className="flex">
                    <MonthZoneVisitorBarChart />
                    <MonthBarVisitorBarChart />
                </div>
            </div>
        </div>
    );
};

export default AdminSwipe;
