import FeaturedCategories from "@/features/main/home/components/FeaturedCategories/FeaturedCategories";
import Newsletter from "@/features/main/home/components/Newsletter/Newsletter";
import ProductGrid from "@/features/main/components/ProductGrid/ProductGrid";
import SpotlightCarousel from "@/features/main/home/components/SpotlightCarousel/SpotlightCarousel";
import Stack from "@mui/material/Stack";

const Home = () => {
  return (
    <Stack>
      <SpotlightCarousel timeout={3000} />
      <FeaturedCategories />
      <ProductGrid />
      <Newsletter />
    </Stack>
  );
};

export default Home;
