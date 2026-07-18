import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductList from "@/features/main/components/ProductList/ProductList";
import { getQueryClient } from "@/utils/query";
import {
  getUserProducts,
  getGetUserProductsQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getUserProductsQueryParams } from "@e-commerce/api-validation/zod/product";

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

interface ProductPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ProductPage = async ({ searchParams }: ProductPageProps) => {
  const resolvedSearchParams = await searchParams;
  const parsedParams = getUserProductsQueryParams.parse(resolvedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetUserProductsQueryKey(parsedParams),
    queryFn: () => getUserProducts(parsedParams),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <div className="w-full py-8">
        <ProductList />
      </div>
    </Hydration>
  );
};

export default ProductPage;
