"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Report {
  report_id: number;
  user_id: number;
  zone_id: number;
  report_status: string;
  report_type: string;
  report_message: string;
  created_time: string;
  report_image: string;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  user_image?: string;
}

interface Zone {
  zone_id: number;
  bar_id: number;
  zone_name: string;
  zone_detail: string;
  max_people_in_zone: number;
  current_visitor_count: number;
  update_date_time: string;
  zone_time: string;
  zone_image?: string;
}

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params.id as string; // ✅ ใช้ useParams() เพื่อดึงค่า id
  const [report, setReport] = useState<Report | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [zone, setZone] = useState<Zone | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูล Report
    axios
      .get(`http://127.0.0.1:8000/api/v1/getReportById/${params.id}`)
      .then((response) => {
        console.log('API Response:', response.data); // Log the entire response
        if (response.data) {
          setReport(response.data); // Set the report data directly
          return response.data;
        }
        throw new Error("Report data is missing.");
      })
      .then((reportData) => {
        console.log('Report Data:', reportData); // Log the report data
        if (reportData && reportData.user_id) {
          // ดึงข้อมูล User
          axios.get(`http://127.0.0.1:8000/api/v1/getUserId/${reportData.user_id}`).then((res) => {
            setUser(res.data);
          }).catch(error => console.error("Error fetching user:", error));
        } else {
          console.error("No user_id found in report data");
        }

        if (reportData && reportData.zone_id) {
          // ดึงข้อมูล Zone
          axios.get(`http://127.0.0.1:8000/api/v1/getZoneById/${reportData.zone_id}`).then((res) => {
            setZone(res.data);
          }).catch(error => console.error("Error fetching zone:", error));
        } else {
          console.error("No zone_id found in report data");
        }
      })
      .catch((error) => console.error("Error fetching report:", error));
  }, [params.id]);



  const updateStatus = async (status: Report["report_status"]) => {
    if (!report) return;
    await axios.put(`http://127.0.0.1:8000/api/v1/updateReport/${report.report_id}`, { status });
    setReport((prev) => prev ? { ...prev, report_status: status } : null);
  };

  const deleteReport = async () => {
    if (!report) return;
    await axios.delete(`http://127.0.0.1:8000/api/v1/deleteReport/${report.report_id}`);
    router.push("/reports");
  };

  if (!report || !user || !zone) {
    return <div className="text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
      <div className="p-8 w-full gap-6 xl:pt-10">
        <h1 className="text-3xl font-bold mb-4">Report {report.report_id}</h1>
        <div className="grid grid-cols-2 gap-x-4">
          {/* รายละเอียด Report */}
          <div className="border p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-2">รายละเอียดรายงาน</h2>
            <div className="text-gray-500 mt-2">แจ้งเมื่อ : {new Date(report.created_time).toLocaleString()}</div>
            <div className="text-zinc-600 pl-4 mt-4">
              <div className="mt-1 text-lg"><strong>สถานะ :</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded font-bold ${report.report_status === "pending"
                    ? "text-yellow-400"
                    : report.report_status === "accepted"
                      ? "text-green-400"
                      : report.report_status === "rejected"
                        ? "text-red-400"
                        : "text-blue-400" // สำหรับ "resolved"
                    }`}
                >
                  {report.report_status}
                </span>
              </div>
              <div className="mt-1 text-lg"><strong className="mr-2">ประเภทปัญหา :</strong> {report.report_type}</div>
              {report.report_message && <div className="mt-1 text-lg"><strong className="mr-2">ข้อความ :</strong> {report.report_message}</div>}
              {report.report_image && (
                <div className="mt-4">
                  <img src={report.report_image} alt="Report" className="w-64 h-64 rounded-lg" />
                </div>
              )}
            </div>
          </div>

          <div>
            {/* รายละเอียดผู้ใช้ */}
            <div className="border p-4 rounded-lg shadow-md mb-6 ">
              <h2 className="text-xl font-semibold">ข้อมูลผู้แจ้ง</h2>
              <div className="flex items-center space-x-4 mt-2 text-zinc-600  mt-4" >
                <img src={user.user_image || "/default-avatar.png"} alt="User" className="w-16 h-16 rounded-full" />
                <div className="pl-16">
                  <div><strong>ชื่อผู้ใช้:</strong> {user.username}</div>
                  <div><strong>อีเมล:</strong> {user.email}</div>
                  <div><strong>บทบาท:</strong> {user.role}</div>
                </div>
              </div>
            </div>

            {/* รายละเอียดโซน */}
            <div className="border p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold">ข้อมูลโซน</h2>
              <div className="flex items-center space-x-4 mt-2 text-zinc-600 mt-4">
                <img src={zone.zone_image || "/default-zone.jpg"} alt="Zone" className="w-32 h-32 rounded-lg" />
                <div>
                  <div><strong>ชื่อโซน:</strong> {zone.zone_name}</div>
                  <div><strong>รายละเอียด:</strong> {zone.zone_detail}</div>
                  <div><strong>จำนวนคนปัจจุบัน:</strong> {zone.current_visitor_count} / {zone.max_people_in_zone}</div>
                  <div><strong>เวลาโซน:</strong> {zone.zone_time}</div>
                  <div><strong>อัปเดตล่าสุด:</strong> {zone.update_date_time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มจัดการ */}
          <div className="flex space-x-4  justify-end">
            {report.report_status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus("accepted")}
                  className="px-4 py-2 duration-200 bg-green-500 shadow-md text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="px-4 py-2 duration-200 bg-red-500 shadow-md text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}

            {report.report_status === "accepted" && (
              <>
                <button
                  onClick={() => updateStatus("resolved")}
                  className="px-4 py-2 duration-200 bg-blue-500 shadow-md text-white rounded hover:bg-blue-600"
                >
                  Finish
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="px-4 py-2 duration-200 bg-red-500 shadow-md text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}

            {report.report_status === "rejected" || report.report_status === "resolved" && (
              <button
                onClick={deleteReport}
                className="px-4 py-2 duration-200 bg-gray-500 shadow-md text-white rounded hover:bg-gray-600"
              >
                🗑 ลบ
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
