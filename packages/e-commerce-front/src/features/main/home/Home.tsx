"use client";
import FeaturedCategories from "@/features/main/home/components/FeaturedCategories/FeaturedCategories";
import Newsletter from "@/features/main/home/components/Newsletter/Newsletter";
import SpotlightCarousel from "@/features/main/home/components/SpotlightCarousel/SpotlightCarousel";
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
    <div className="flex flex-col gap-12 pb-12">
      <SpotlightCarousel timeout={5000} />
      <div className="w-full flex flex-col gap-12">
        <FeaturedCategories />
        <SuspenseWrapper height={500}>
          <ProductGrid params={{ page: 1, pageSize: 8 }} />
        </SuspenseWrapper>
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
