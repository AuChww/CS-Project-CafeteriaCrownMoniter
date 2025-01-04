// pages/recommend/bar/[id].tsx
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
  bar_image: string;
}

type Props = {
  bar: Bar | null;
};

const BarPage: NextPage<Props> = ({ bar }) => {
  const router = useRouter();

  if (!bar) {
    console.log(`No data found for Bar ID: ${router.query.id}`);
    return <div>ไม่พบข้อมูลสำหรับ Bar ID: {router.query.id}</div>;
  }

  console.log("Rendering Bar data:", bar);

  return (
    <div className="container mx-auto p-4">
      <h1>bar name</h1>
      <div className="flex justify-evenly">
        <h1>Vdo</h1>
        <div>
          <div>person in bar</div>
          <h2>bar location</h2>
        </div>
      </div>
      <div>
        <div>
        <img src="" alt="" />
        <h1>bar detail</h1>
        </div>
        <h1></h1>
       
      </div>


    </div>
  );
};

// ดึงข้อมูล bar โดยใช้ id จาก URL
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.params!; // ดึง id จาก URL
  const res = await fetch(`http://127.0.0.1:8000/api/v1/getBarId/${id}`);

  if (!res.ok) {
    console.log(`Failed to fetch data for Bar ID: ${id}`);
    return {
      props: {
        bar: null, // ถ้า API ไม่ตอบสนองหรือไม่เจอข้อมูล
      },
    };
  }

  const bar: Bar = await res.json();
  return {
    props: {
      bar,
    },
  };
};

export default BarPage;
