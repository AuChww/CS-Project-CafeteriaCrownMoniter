import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CrowdCardProps {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  max_people_in_bar: number;
  bar_image: string;
  bar_detail: string;
}

const CrowdCard: React.FC<CrowdCardProps> = ({
  bar_id,
  bar_name,
  bar_location,
  max_people_in_bar,
  bar_image,
  bar_detail,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/pages/recommend/bar/${bar_id}`)}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:bg-gray-100"
    >
      <Image
        src={`/images/${bar_image}`} // Adjust the path based on your setup
        alt={bar_name}
        width={200}
        height={150}
        className="rounded-lg mb-4"
      />
      <h2 className="text-2xl font-semibold text-black mb-2">{bar_name}</h2>
      <p className="text-sm text-gray-500">{bar_detail}</p>
      <p className="text-lg text-gray-900 font-bold mt-2 mb-2"> 0 / {max_people_in_bar}</p>
      <p className="text-sm text-gray-500">Location: {bar_location}</p>
    </div>
  );
};

export default CrowdCard;
