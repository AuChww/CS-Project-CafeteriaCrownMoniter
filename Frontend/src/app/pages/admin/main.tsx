"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSwipe from "@/components/admin_component/AdminSwipe";
import AdminCrowdCard from "@/components/admin_component/AdminCrowdCard";
import AddBar from "@/components/admin_component/bar_button/addBar";
import DeleteBar from "@/components/admin_component/bar_button/deleteBar";
import EditBar from "@/components/admin_component/bar_button/editBar";
import AddTab from "@/components/admin_component/bar_button/addTab";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import PopUpEditBar from "@/components/admin_component/bar_button/popUpEditBar";
import PopUpDeleteBar from "@/components/admin_component/bar_button/popUpDeleteBar";

interface Bar {
  bar_id: number;
  bar_name: string;
  max_people_in_bar: number;
  bar_detail: string;
  bar_image: string;
  bar_location: string;
  total_rating: number;
  total_reviews: number;
}

export default function Admin() {
  const [bars, setBars] = useState<Bar[]>([]);
  const router = useRouter();
  const [showEditPopup, setShowEditPopup] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedBarId, setSelectedBarId] = useState<number | null>(null);

  const handleEditClick = (barId: number) => {
    setSelectedBarId(barId);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (barId: number) => {
    setSelectedBarId(barId);
    setShowDeletePopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedBarId(null);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedBarId(null);
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
        if (!response.ok) {
          throw new Error("Failed to fetch bars");
        }
        const data = await response.json();
        setBars(data.bars); // Assuming the API returns { bars: [...] }
      } catch (error) {
        console.error("Error fetching bars:", error);
      }
    };

    fetchBars();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100 w-full h-screen overflow-y-auto">
      <div className="mt-14">
        <AdminSwipe />
      </div>
      <div className=" flex justify-start mt-10">
        <AddTab></AddTab>
      </div>

      <div className="grid grid-cols-1 mt-6 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {bars.map((bar) => (
          <div key={bar.bar_id} className="bg-white hover:scale-110 duration-300  rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100"
          //  onClick={() => router.push(`/pages/recommend/bar/${bar.bar_id}`)}
          >
            <AdminCrowdCard
              key={bar.bar_id}
              bar_id={bar.bar_id}
              bar_name={bar.bar_name}
              bar_location={bar.bar_location}
              max_people_in_bar={bar.max_people_in_bar}
              bar_image={bar.bar_image}
              bar_detail={bar.bar_detail}
            />
            <div className="flex justify-end mt-2 mr-1">
              <div onClick={() => handleEditClick(bar.bar_id)}>
                <MdEdit className="text-gray-600 w-6 h-6 cursor-pointer" />
              </div>
              <div onClick={() => handleDeleteClick(bar.bar_id)}>ttt
                <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
              </div>
            </div>

            {showEditPopup && selectedBarId && (
              <PopUpEditBar barId={selectedBarId} onClose={closeEditPopup} />
            )}

            {showDeletePopup && selectedBarId && (
              <PopUpDeleteBar barId={selectedBarId} onClose={closeDeletePopup} />
            )}
          </div>
        ))}
      </div>
    </div >
  );
}
