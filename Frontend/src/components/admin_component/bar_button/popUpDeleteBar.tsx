const PopUpDeleteBar = ({ barId, onClose }: { barId: number; onClose: () => void }) => {
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
      <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-80">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this bar (ID: {barId})?</p>
          <div className="mt-4 flex justify-between">
            <button onClick={onClose} className="text-gray-600">Cancel</button>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PopUpDeleteBar;
  