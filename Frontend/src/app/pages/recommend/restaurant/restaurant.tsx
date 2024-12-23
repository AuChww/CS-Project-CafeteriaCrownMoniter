import React, { useEffect, useState } from 'react';

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
}

const BarPage: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/getAllBars'); // แก้ไข URL ให้ตรงกับ API ของคุณ
        if (!response.ok) {
          throw new Error('Failed to fetch bars');
        }
        const data: Bar[] = await response.json();
        setBars(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Bars</h1>
      <ul>
        {bars.map((bar) => (
          <li key={bar.bar_id}>
            <h2>{bar.bar_name}</h2>
            <p>Location: {bar.bar_location}</p>
            <p>Details: {bar.bar_detail}</p>
            <p>Rating: {bar.total_rating} ({bar.total_reviews} reviews)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarPage;
