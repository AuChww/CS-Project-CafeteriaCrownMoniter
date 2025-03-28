"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface Report {
  report_id: number;
  user_id: number;
  zone_id: number;
  report_status: string;
  report_type: string;
  report_message: string;
  created_time: string;
  report_image: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  user_image?: string;
}

export interface Zone {
  zone_id: number;
  zone_name: string;
  zone_detail: string;
  max_people_in_zone: number;
  current_visitor_count: number;
  update_date_time: string;
  zone_time: string;
  zone_image?: string;
}

const ReportCheck = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/getAllReports").then((response) => {
      setReports(response.data.reports);
    });

    axios.get("http://127.0.0.1:8000/api/v1/getAllUsers").then((response) => {
      setUsers(response.data.users);
    });

    axios.get("http://127.0.0.1:8000/api/v1/getAllZones").then((response) => {
      setZones(response.data.zones);
    });
  }, []);

  const updateStatus = async (id: number, status: Report["report_status"]) => {

    console.log(status);
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/updateReport/${id}`, {
        status,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.report_id === id ? { ...r, report_status: status } : r
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteReport = async (id: number) => {
    await axios.delete(`http://127.0.0.1:8000/api/v1/deleteReport/${id}`);
    setReports((prev) => prev.filter((r) => r.report_id !== id));
  };

  const getUserName = (user_id: number) => {
    const user = users.find((u) => u.user_id === user_id);
    return user ? user.username : "ไม่พบผู้ใช้";
  };

  const getZoneName = (zone_id: number) => {
    const zone = zones.find((z) => z.zone_id === zone_id);
    return zone ? zone.zone_name : "ไม่พบโซน";
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">รายการรายงาน</h1>
      <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-center px-4 py-2">ID</th>
            <th className="text-center px-4 py-2">ผู้รายงาน</th>
            <th className="text-center px-4 py-2">โซน</th>
            <th className="text-center px-4 py-2">สถานะ</th>
            <th className="text-center px-4 py-2">ข้อความรายงาน</th>
            <th className="text-center px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr
              key={r.report_id}
              className="border-t cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/pages/report/${r.report_id}`)}
            >
              <td className="text-center px-4 py-2">{r.report_id}</td>
              <td className="text-center px-4 py-2">
                {getUserName(r.user_id)}
              </td>
              <td className="text-center px-4 py-2">
                {getZoneName(r.zone_id)}
              </td>
              <td className="text-center px-4 py-2">
                <span
                  className={`ml-2 px-2 py-1 rounded font-bold ${
                    r.report_status === "pending"
                      ? "text-yellow-400"
                      : r.report_status === "accepted"
                      ? "text-green-400"
                      : r.report_status === "rejected"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {r.report_status}
                </span>
              </td>
              <td className="text-center px-4 py-2">{r.report_message}</td>
              <td className="flex justify-end gap-x-2 px-4 py-2 ">
                {r.report_status === "pending" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(r.report_id, "accepted");
                      }}
                      className="px-4 py-2 duration-200 bg-green-500 shadow-md text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(r.report_id, "rejected");
                      }}
                      className="px-4 py-2 duration-200 bg-red-500 shadow-md text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {r.report_status === "accepted" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(r.report_id, "resolved");
                      }}
                      className="px-4 py-2 duration-200 bg-blue-500 shadow-md text-white rounded hover:bg-blue-600"
                    >
                      Finish
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(r.report_id, "rejected");
                      }}
                      className="px-4 py-2 duration-200 bg-red-500 shadow-md text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {(r.report_status === "rejected" ||
                  r.report_status === "resolved") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(r.report_id);
                    }}
                    className="px-4 py-2 duration-200 bg-gray-500 shadow-md text-white rounded hover:bg-gray-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportCheck;
