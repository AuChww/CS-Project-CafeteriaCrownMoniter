// pages/recommend/bar/[id].tsx
import { useRouter } from 'next/router';

const BarPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>Bar ID: {id}</div>;
};

export default BarPage;
