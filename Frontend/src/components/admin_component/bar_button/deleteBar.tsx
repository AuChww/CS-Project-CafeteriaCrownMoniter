import { useState } from 'react';
import { MdDeleteForever } from "react-icons/md";

// Explicitly typing the props
interface DeleteBarProps {
  onDelete: () => void;  // Type onDelete as a function that doesn't return anything
}

const DeleteBar: React.FC<DeleteBarProps> = ({ onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();  // Call the onDelete function when confirmed
    setShowConfirmation(false);  // Hide confirmation dialog
  };

  return (
    <div>
      {showConfirmation ? (
        <div style={{ padding: '10px', border: '2px solid red', marginTop: '10px' }}>
          <p>Are you sure you want to delete this item?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <span
              onClick={handleConfirmDelete}
              style={{ cursor: 'pointer', backgroundColor: 'red', color: 'white', padding: '5px 10px' }}
            >
              Confirm
            </span>
            <span
              onClick={() => setShowConfirmation(false)}
              style={{ cursor: 'pointer', border: '1px solid gray', padding: '5px 10px' }}
            >
              Cancel
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setShowConfirmation(true)}
        >
          <MdDeleteForever className='text-red-600 w-6 h-6' />
        </div>
      )}
    </div>
  );
};

export default DeleteBar;
