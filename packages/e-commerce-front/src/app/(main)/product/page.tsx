import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductList from "@/features/main/components/ProductList/ProductList";
import { getQueryClient } from "@/utils/query";
import {
  getUserProducts,
  getGetUserProductsQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm | E-Commerce",
  description:
    "Khám phá danh sách sản phẩm chất lượng hàng đầu tại cửa hàng E-Commerce của chúng tôi. Mua sắm dễ dàng, giao hàng nhanh chóng.",
  openGraph: {
    title: "Danh sách sản phẩm | E-Commerce",
    description:
      "Khám phá danh sách sản phẩm chất lượng hàng đầu tại cửa hàng E-Commerce của chúng tôi. Mua sắm dễ dàng, giao hàng nhanh chóng.",
    type: "website",
    url: "https://e-commerce.com/product",
    siteName: "E-Commerce",
    images: [
      {
        url: "https://e-commerce.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Danh sách sản phẩm | E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh sách sản phẩm | E-Commerce",
    description:
      "Khám phá danh sách sản phẩm chất lượng hàng đầu tại cửa hàng E-Commerce của chúng tôi. Mua sắm dễ dàng, giao hàng nhanh chóng.",
    images: ["https://e-commerce.com/og-image.jpg"],
  },
};

const ProductPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetUserProductsQueryKey(),
    queryFn: () => getUserProducts(),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductList />
    </Hydration>
  );
};

export default ProductPage;
