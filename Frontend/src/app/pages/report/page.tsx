"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const ReportPage = () => {
    const searchParams = useSearchParams();
    const defaultZoneId = searchParams.get("zone_id") || ""; // ✅ รับ zone_id จาก URL
    const router = useRouter();

    const [zones, setZones] = useState<{ zone_id: number; zone_name: string }[]>([]);
    const [selectedZone, setSelectedZone] = useState(defaultZoneId);
    const [reportType, setReportType] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/v1/getAllZones").then((response) => {
            setZones(response.data.zones);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("user_id", "1"); // TODO: ดึงจากระบบ auth
        formData.append("zone_id", selectedZone);
        formData.append("report_status", "pending");
        formData.append("report_type", reportType);
        formData.append("report_message", reportMessage);
        if (image) {
            formData.append("report_image", image);
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/v1/addReport", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("รายงานปัญหาสำเร็จ!");
            router.push("/"); // ✅ กลับไปหน้าแรก
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
            <div className="w-full gap-6 xl:pt-10 p-8">
                <h1 className="text-3xl font-bold mb-6">รายงานปัญหา</h1>

                <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-lg shadow-md">
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
                        <label className="block text-gray-700">แนบรูปภาพ (ถ้ามี):</label>
                        <input type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
                    </div>

                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg">
                        {loading ? "กำลังส่ง..." : "ส่งรายงาน"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportPage;
