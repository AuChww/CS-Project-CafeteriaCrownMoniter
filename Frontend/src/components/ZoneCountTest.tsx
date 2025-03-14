// components/UpdateZoneCountButton.js

import { useState } from 'react';

const UpdateZoneCountButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleUpdateCount = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/updateCountAllZones', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error updating zone counts');
            }

            const data = await response.json();
            console.log('Updated Counts:', data.updated_counts);
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handleUpdateCount} 
                disabled={loading}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Updating...' : 'Update Zone Count'}
            </button>
            
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {success && <div style={{ color: 'green' }}>Zone counts updated successfully!</div>}
        </div>
    );
};

export default UpdateZoneCountButton;
