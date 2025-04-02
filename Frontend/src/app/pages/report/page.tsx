"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import AddReportModal from "@/components/modal/AddReportModal";


const ReportPageContent = () => {
    const searchParams = useSearchParams();
    const defaultZoneId = searchParams.get("zone_id") || "";
    const router = useRouter();
    const { user } = useAuth();

    const [zones, setZones] = useState<{ zone_id: number; zone_name: string }[]>(
        []
    );
    const [selectedZone, setSelectedZone] = useState(defaultZoneId);
    const [reportType, setReportType] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        router.push("/");
    };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/v1/getAllZones").then((response) => {
            setZones(response.data.zones);
        });
    }, []);

    useEffect(() => {
        if (zones.length > 0 && !selectedZone) {
            setSelectedZone(zones[0]?.zone_id.toString()); // แก้ปัญหาโซนไม่เข้า
        }
    }, [zones]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push("/pages/authenticate/login");
            return;
        }

        if (!reportType.trim() || !reportMessage.trim()) {
            alert("กรุณากรอกประเภทปัญหาและรายละเอียดปัญหาก่อนส่งรายงาน");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("user_id", user?.userId);
        formData.append("zone_id", selectedZone);
        formData.append("report_status", "pending");
        formData.append("report_type", reportType);
        formData.append("report_message", reportMessage);

        if (imageFile) {
            formData.append("report_image", imageFile);
        } else {
            formData.append("report_image", "null");
        }

        console.log("FormData:", Object.fromEntries(formData.entries()));

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/addReport", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toggleModal();
            } else {
                alert(data.message || "Failed to add report");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>


            <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
                <div className="w-full gap-6 xl:pt-10 p-8">
                    <h1 className="text-3xl font-bold mb-6">รายงานปัญหา</h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 w-full bg-white p-6 rounded-lg shadow-md"
                    >
                        <div>
                            <label className="block text-gray-700">โซน:</label>
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                {zones.map((zone) => (
                                    <option key={zone.zone_id} value={zone.zone_id}>
                                        {zone.zone_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">ประเภทปัญหา:</label>
                            <input
                                type="text"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">รายละเอียดปัญหา:</label>
                            <textarea
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Upload file
                            </label>
                            <input
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                id="reviewImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setImageFile(e.target.files?.[0] || null)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-lg"
                        >
                            {loading ? "กำลังส่ง..." : "ส่งรายงาน"}
                        </button>
                    </form>
                </div>
            </div>

            {isModalOpen && <AddReportModal toggleModal={toggleModal} />}
        </>
    );
};

const ReportPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReportPageContent />
        </Suspense>
    );
};

export default ReportPage;
