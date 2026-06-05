import FeaturedProducts from "@/components/FeaturedProducts";
import HomeCategories from "@/components/HomeCategories";


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HomeCategories />
      <FeaturedProducts/>
    </div>
  );
};

export default Home;
