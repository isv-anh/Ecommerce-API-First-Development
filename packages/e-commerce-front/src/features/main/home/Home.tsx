"use client";
import FeaturedCategories from "@/features/main/home/components/FeaturedCategories/FeaturedCategories";
import Newsletter from "@/features/main/home/components/Newsletter/Newsletter";
import SpotlightCarousel from "@/features/main/home/components/SpotlightCarousel/SpotlightCarousel";
import Stack from "@mui/material/Stack";
import SupenseWrapper from "@/components/data-display/SupenseWrapper/SupenseWrapper";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";

const ProductGrid = dynamic(
  () => import("@/features/main/components/ProductGrid/ProductGrid"),
  {
    ssr: false,
    loading: () => <Skeleton height={500} />,
  },
);

const Home = () => {
  return (
    <Stack>
      <SpotlightCarousel timeout={3000} />
      <FeaturedCategories />
      <SupenseWrapper height={500}>
        <ProductGrid />
      </SupenseWrapper>
      <Newsletter />
    </Stack>
  );
};

export default Home;
