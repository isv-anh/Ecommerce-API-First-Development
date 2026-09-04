import {
  Product,
  SearchProductRequest,
} from "@/buf/generated/product/v1/product";
import { esClient } from "@/config/elasticsearch";

export async function updateProduct(product: Product): Promise<void> {
  await esClient.index({
    index: "products",
    id: product.productId,
    document: {
      productId: product.productId,
      productName: product.productName,
      description: product.description,
      price: product.price,
      categoryName: product.categoryName,
      thumbnailUrl: product.thumbnailUrl,
      brandName: product.brandName,
      slug: product.slug,
    },
  });
}

function parseSort(sort?: string) {
  if (!sort) {
    return undefined;
  }

  return sort.split(",").map((item) => {
    const [field, order] = item.split(":");

    return {
      [field]: order === "desc" ? "desc" : "asc",
    };
  });
}

export async function searchProducts(
  params: SearchProductRequest,
): Promise<Product[]> {
  const {
    keyword,
    categoryName,
    brandName,
    minPrice,
    maxPrice,
    page,
    pageSize,
    sort,
  } = params;

  const pageNumber = page ?? 1;
  const pageSizeNumber = pageSize ?? 20;

  const filters = [];

  if (categoryName) {
    filters.push({
      term: {
        categoryName,
      },
    });
  }

  if (brandName) {
    filters.push({
      term: {
        brandName,
      },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.push({
      range: {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    });
  }

  const result = await esClient.search<Product>({
    index: "products",

    // Pagination
    from: (pageNumber - 1) * pageSizeNumber,
    size: pageSizeNumber,

    ...(sort && {
      sort: parseSort(sort),
    }),

    query: {
      bool: {
        must: keyword
          ? [
              {
                multi_match: {
                  query: keyword,
                  fields: [
                    "productName^3",
                    "description",
                    "categoryName^2",
                    "brandName^2",
                  ],
                  fuzziness: "AUTO",
                  prefix_length: 2,
                  max_expansions: 50,
                },
              },
            ]
          : [],
        filter: filters,
      },
    },
  });

  return result.hits.hits
    .map((hit) => hit._source)
    .filter((product): product is Product => product !== undefined);
}
