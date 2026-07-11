"use client";
import FeaturedCategories from "@/features/main/home/components/FeaturedCategories/FeaturedCategories";
import Newsletter from "@/features/main/home/components/Newsletter/Newsletter";
import SpotlightCarousel from "@/features/main/home/components/SpotlightCarousel/SpotlightCarousel";
import Stack from "@mui/material/Stack";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
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
      <SuspenseWrapper height={500}>
        <ProductGrid params={{ page: 1, pageSize: 8 }} />
      </SuspenseWrapper>
      <Newsletter />
    </Stack>
  );
};

export default Home;
