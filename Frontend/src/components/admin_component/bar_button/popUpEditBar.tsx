const PopUpEditBar = ({ onClose }: { onClose: () => void }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Editing bar...');
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Edit Bar</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Bar Name" className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Bar Location" className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Bar Detail" className="w-full p-2 border rounded" required />
            <input type="file" className="w-full p-2 border rounded" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Submit</button>
          </form>
          <button onClick={onClose} className="mt-4 text-red-500">Close</button>
        </div>
      </div>
    );
  };
  
  export default PopUpEditBar;
  