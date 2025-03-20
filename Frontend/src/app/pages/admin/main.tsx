"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import AdminSwipe from "@/components/admin_component/AdminSwipe";
import AdminCrowdCard from "@/components/admin_component/AdminCrowdCard";
import AddTab from "@/components/admin_component/bar_button/addTab";
import EditTab from "@/components/admin_component/bar_button/editTab";


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

  const fetchBars = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
      if (!response.ok) {
        throw new Error("Failed to fetch bars");
      }
      const data = await response.json();
      setBars(data.bars);
    } catch (error) {
      console.error("Error fetching bars:", error);
    }
  };

  useEffect(() => {
    fetchBars();
  }, []);

  const handleDelete = async (bar_id: number, bar_name: string) => {
    const confirmDelete = window.confirm(`Are you sure to delete Bar ${bar_id} : ${bar_name} ?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/deleteBar/${bar_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBars();
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      console.error("Error deleting bar:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 w-full h-screen overflow-y-auto">
      <div className="mt-14">
        <AdminSwipe />
      </div>
      <div className="flex gap-x-2 justify-end mt-10">
        <AddTab />
        <EditTab></EditTab>
      </div>

      <div className="grid grid-cols-1 mt-6 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {bars.map((bar) => (
          <div
            key={bar.bar_id}
            className="bg-white hover:scale-110 duration-300 rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100"
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
              <div onClick={() => handleDelete(bar.bar_id, bar.bar_name)}>
                <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
