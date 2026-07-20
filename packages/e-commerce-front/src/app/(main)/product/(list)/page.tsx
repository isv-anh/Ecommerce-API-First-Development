import type { Metadata } from "next";
import { getUserProductsQueryParams } from "@e-commerce/api-validation/zod/product";

interface ProductPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// TODO: optimize metadata
export async function generateMetadata({
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const parsedParams = getUserProductsQueryParams.parse(resolvedSearchParams);

  let title = "Danh sách sản phẩm | E-Commerce";
  if (parsedParams.productName) {
    title = `Kết quả tìm kiếm: ${parsedParams.productName} | E-Commerce`;
  }

  return {
    title,
    description:
      "Khám phá danh sách sản phẩm chất lượng hàng đầu tại cửa hàng E-Commerce của chúng tôi. Mua sắm dễ dàng, giao hàng nhanh chóng.",
    openGraph: {
      title,
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
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Khám phá danh sách sản phẩm chất lượng hàng đầu tại cửa hàng E-Commerce của chúng tôi. Mua sắm dễ dàng, giao hàng nhanh chóng.",
      images: ["https://e-commerce.com/og-image.jpg"],
    },
  };
}

export default function ProductRootPage() {
  return null;
}
