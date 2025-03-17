import Image from "next/image";
import { MdEdit, MdDeleteForever } from "react-icons/md"; //แก้ไขการนำเข้าที่ซ้ำ
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PopUpEditBar from "./bar_button/popUpEditBar";
import PopUpDeleteBar from "./bar_button/popUpDeleteBar";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleEditClick = () => setShowEditPopup(true);
  const handleDeleteClick = () => setShowDeletePopup(true);

  const closeEditPopup = () => setShowEditPopup(false);
  const closeDeletePopup = () => setShowDeletePopup(false);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        // Fetch visitor data logic here...
        const zonesRes = await fetch(
          `http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${bar_id}`
        );
        const zonesData = await zonesRes.json();

        let totalZoneVisitors = (zonesData.zones || []).reduce(
          (sum: number, zone: { current_visitor_count: number }) =>
            sum + zone.current_visitor_count,
          0
        );

        let totalRestaurantVisitors = 0;
        await Promise.all(
          zonesData.zones.map(async (zone: { zone_id: number }) => {
            const restaurantRes = await fetch(
              `http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${zone.zone_id}`
            );
            const restaurantData = await restaurantRes.json();
            totalRestaurantVisitors += (
              restaurantData.restaurants || []
            ).reduce(
              (sum: number, restaurant: { current_visitor_count?: number }) =>
                sum + (restaurant.current_visitor_count || 0),
              0
            );
          })
        );

        setCurrentVisitors(totalZoneVisitors + totalRestaurantVisitors);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getBarImage/bar${bar_id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchVisitorData();
  }, [bar_id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/deleteBar/${bar_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("ลบข้อมูลสำเร็จ");
        router.push("/admin/dashboard");
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      console.error("Error deleting bar:", error);
    }
  };

  return (
    <div className="bg-white hover:scale-110 duration-300 rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100">
      <div onClick={() => router.push(`/pages/recommend/bar/${bar_id}`)}>
        <div className="h-full flex">
          {imageUrl ? (
            <img
              className="rounded-t-lg w-1/2 h-full"
              src={imageUrl}
              alt="Image"
              width="500"
            />
          ) : (
            <div>Loading image...</div>
          )}
          <a href="#">
            <h5 className="ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
              {bar_name.length > 20 ? `${bar_name.slice(0, 20)}...` : bar_name}
            </h5>
          </a>
        </div>
        <div className="px-2 flex justify-between">
          <div className="flex mt-2">
            <div className="mt-1 mr-2 text-xs">visitor:</div>
            <div className="text-md">
              {currentVisitors} / {max_people_in_bar}
            </div>
          </div>
        </div>
        {/* Edit and Delete icons */}
        {/* <div className="flex justify-end mt-2 mr-1">
          <div onClick={handleEditClick}>
            <MdEdit className="text-gray-600 w-6 h-6 cursor-pointer" />
          </div>
          <div onClick={handleDeleteClick}>
            <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
          </div>
        </div> */}
        {/* Show popups */}
        {/* {showEditPopup && <PopUpEditBar onClose={closeEditPopup} />}
        {showDeletePopup && <PopUpDeleteBar onClose={closeDeletePopup} />} */}
      </div>
    </div>
  );
};

export default AdminCrowdCard;
