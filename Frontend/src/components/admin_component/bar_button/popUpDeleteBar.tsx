import { useEffect, useState } from 'react';

const PopUpDeleteBar = ({ barId, onClose }: { barId: number; onClose: () => void }) => {
    const [barName, setBarName] = useState<string>('');

    useEffect(() => {
        const fetchBarData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${barId}`);
                const data = await response.json();
                setBarName(data.bar_name); // ตั้งชื่อบาร์จากข้อมูลที่ดึงมา
            } catch (error) {
                console.error('Error fetching bar data:', error);
            }
        };

        fetchBarData();
    }, [barId]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/deleteBar/${barId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Bar deleted successfully');
                onClose(); // ปิด Popup หลังจากลบสำเร็จ
            } else {
                console.error('Failed to delete bar');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="fixed z-40 inset-0 bg-black bg-opacity-25 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion Bar {barId}</h2>
                {barName ? (
                    <div>
                        <h1 className="text-lg mb-4">{barName}</h1>
                        <p>Are you sure you want to delete the bar {barId} ?</p>
                    </div>
                ) : (
                    <p>Loading bar data...</p>
                )}
                <div className="mt-4 flex justify-between">
                    <button onClick={onClose} className="text-gray-600">Cancel</button>
                    <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default PopUpDeleteBar;
