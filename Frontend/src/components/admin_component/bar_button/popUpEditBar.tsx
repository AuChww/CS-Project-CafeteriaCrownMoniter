import { useEffect, useState } from 'react';

interface BarData {
  bar_name: string;
  max_people_in_bar: number;
  bar_detail: string;
  bar_image: string;
  bar_location: string;
}

const PopUpEditBar = ({ barId, onClose }: { barId: number; onClose: () => void }) => {
  const [barData, setBarData] = useState<BarData>({
    bar_name: '',
    max_people_in_bar: 0,
    bar_detail: '',
    bar_image: '',
    bar_location: '',
  });

  const [updatedData, setUpdatedData] = useState<Partial<BarData>>({});

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${barId}`);
        const data = await response.json();
        setBarData(data);
        setUpdatedData(data); // Initializing updatedData with the fetched data
      } catch (error) {
        console.error('Error fetching bar data:', error);
      }
    };

    fetchBarData();
  }, [barId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: value, // Directly update the corresponding field in updatedData
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/updateBar/${barId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        console.log('Bar updated successfully');
        onClose(); // ปิด Popup หลังจากอัปเดตสำเร็จ
      } else {
        console.error('Failed to update bar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Bar ID: {barId}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="bar_name"
            value={updatedData.bar_name || ''}
            onChange={handleChange}
            placeholder={barData.bar_name || 'Enter bar name'}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="bar_location"
            value={updatedData.bar_location || ''}
            onChange={handleChange}
            placeholder={barData.bar_location || 'Enter bar location'}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="bar_detail"
            value={updatedData.bar_detail || ''}
            onChange={handleChange}
            placeholder={barData.bar_detail || 'Enter bar detail'}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="max_people_in_bar"
            value={updatedData.max_people_in_bar || ''}
            onChange={handleChange}
            placeholder={barData.max_people_in_bar ? String(barData.max_people_in_bar) : 'Enter max people'}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Update</button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">Close</button>
      </div>
    </div>
  );
};

export default PopUpEditBar;
