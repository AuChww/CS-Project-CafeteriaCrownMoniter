// import { useEffect, useState } from 'react';

// interface BarData {
//   bar_name: string;
//   max_people_in_bar: number;
//   bar_detail: string;
//   bar_image: string;
//   bar_location: string;
// }

// const PopUpEditBar = ({ barId, onClose }: { barId: number; onClose: () => void }) => {
//   const [barData, setBarData] = useState<BarData | null>(null); // Change initial state to null
//   const [updatedData, setUpdatedData] = useState<Partial<BarData>>({});

//   // useEffect(() => {
//   //   const fetchBarData = async () => {
//   //     try {
//   //       const response = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${barId}`);
//   //       const data = await response.json();
//   //       setBarData(data);  // Set barData once, when barId changes
//   //       setUpdatedData(data); // Initialize updatedData with the fetched data
//   //     } catch (error) {
//   //       console.error('Error fetching bar data:', error);
//   //     }
//   //   };

//   //   fetchBarData();
//   // }, [barId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // ใช้ keyof เพื่อระบุว่า name จะต้องเป็น key ของ Partial<BarData>
//     if (name in updatedData) { // This ensures name is a valid key of updatedData
//       setUpdatedData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/v1/updateBar/${barId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (response.ok) {
//         console.log('Bar updated successfully');
//         onClose(); // Close popup after update is successful
//       } else {
//         console.error('Failed to update bar');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Show loading state if barData is still being fetched
//   if (!barData) {
//     return (
//       <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg w-96">
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-lg font-semibold mb-4">Edit Bar ID: {barId}</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="bar_name"
//             value={updatedData.bar_name || ''}
//             onChange={handleChange}
//             placeholder={barData.bar_name || 'Enter bar name'}
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="bar_location"
//             value={updatedData.bar_location || ''}
//             onChange={handleChange}
//             placeholder={barData.bar_location || 'Enter bar location'}
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="bar_detail"
//             value={updatedData.bar_detail || ''}
//             onChange={handleChange}
//             placeholder={barData.bar_detail || 'Enter bar detail'}
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="max_people_in_bar"
//             value={updatedData.max_people_in_bar || ''}
//             onChange={handleChange}
//             placeholder={barData.max_people_in_bar ? String(barData.max_people_in_bar) : 'Enter max people'}
//             className="w-full p-2 border rounded"
//           />
//           <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Update</button>
//         </form>
//         <button onClick={onClose} className="mt-4 text-red-500">Close</button>
//       </div>
//     </div>
//   );
// };

// export default PopUpEditBar;

import { useState, useEffect } from 'react';
import EditForm from './editForm';

// กำหนดประเภทของ props ใน interface
interface PopUpEditBarProps {
  barId: string | number;  // กำหนดประเภทของ barId
  onClose: () => void;     // กำหนดประเภทของ onClose (เป็นฟังก์ชันที่ไม่มีค่า return)
}

const PopUpEditBar: React.FC<PopUpEditBarProps> = ({ barId, onClose }) => {
  const [barData, setBarData] = useState<any>(null);  // ใช้ any สำหรับ barData เนื่องจากข้อมูลจะมาจาก API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันที่ใช้ในการ fetch ข้อมูล bar ตาม bar_id
  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${barId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data) {
          setBarData(data);
        } else {
          throw new Error('No data found for the given barId');
        }
      } catch (error) {
        console.error('Error fetching bar data:', error);
        // setError(error.message); // ตั้งค่าข้อความผิดพลาด
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarData();
  }, [barId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;  // แสดงข้อผิดพลาดถ้ามี
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* เมื่อ fetch ข้อมูลเสร็จแล้ว ให้ส่งข้อมูลไปที่ EditForm */}
      <EditForm barData={barData} onClose={onClose} />
    </div>
  );
};

export default PopUpEditBar;

