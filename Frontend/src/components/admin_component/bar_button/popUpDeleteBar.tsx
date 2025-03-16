const PopUpDeleteBar = ({ onClose }: { onClose: () => void }) => {
    const handleDelete = () => {
      console.log('Deleting bar...');
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-80">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this bar?</p>
          <div className="mt-4 flex justify-between">
            <button onClick={onClose} className="text-gray-600">Cancel</button>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PopUpDeleteBar;
  