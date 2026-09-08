import * as grpc from "@grpc/grpc-js";
import {
  Product,
  ProductResponse,
  ProductServiceClient,
  SearchProductRequest,
} from "@/buf/generated/product/v1/product";
import { Empty } from "@/buf/generated/google/protobuf/empty";

const client = new ProductServiceClient(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

// Wrapper chuyển đổi callback gRPC sang Promise để dùng async/await dễ dàng
const updateProductAsync = (product: Product): Promise<Empty> => {
  return new Promise((resolve, reject) => {
    client.updateProduct(product, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

const searchProductAsync = (
  req: SearchProductRequest,
): Promise<ProductResponse> => {
  return new Promise((resolve, reject) => {
    client.searchProduct(req, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// Hàm delay để Elasticsearch kịp refresh chỉ mục
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  console.log("--- BẮT ĐẦU CHẠY TEST ---");

  // 1. Dữ liệu mẫu 3 sản phẩm
  const mockProducts: Product[] = [
    {
      productId: "prod-001",
      productName: "Laptop Apple MacBook Air M2",
      description:
        "Máy tính xách tay mỏng nhẹ, pin trâu, màn hình Retina 13.6 inch",
      price: 24990000,
      categoryName: "Laptop",
      brandName: "Apple",
      slug: "laptop-macbook-air-m2",
      thumbnailUrl: "https://example.com/macbook-m2.jpg",
    },
    {
      productId: "prod-002",
      productName: "Laptop Gaming ASUS ROG Zephyrus G14",
      description: "Cấu hình mạnh mẽ cho game thủ và đồ họa nặng với RTX 4060",
      price: 35990000,
      categoryName: "Laptop",
      brandName: "ASUS",
      slug: "laptop-asus-rog-g14",
      thumbnailUrl: "https://example.com/asus-rog.jpg",
    },
    {
      productId: "prod-003",
      productName: "Bàn phím cơ không dây Keychron K2",
      description:
        "Phụ kiện gõ phím cho máy tính, kết nối Bluetooth đa thiết bị",
      price: 1850000,
      categoryName: "Phụ kiện",
      brandName: "Keychron",
      slug: "ban-phim-co-keychron-k2",
      thumbnailUrl: "https://example.com/keychron-k2.jpg",
    },
  ];

  try {
    // 2. Thêm 3 sản phẩm vào hệ thống
    console.log("Đang tạo 3 sản phẩm...");
    for (const prod of mockProducts) {
      await updateProductAsync(prod);
      console.log(`✓ Đã thêm: ${prod.productName}`);
    }

    // 3. Đợi 1.2 giây để Elasticsearch hoàn tất Indexing Refresh
    console.log("Đang đợi Elasticsearch cập nhật dữ liệu...");
    await sleep(1200);

    // 4. Test tìm kiếm từ khóa "laptop"
    console.log('\n--- KẾT QUẢ TÌM KIẾM KEYWORD: "laptop" ---');
    const searchRes = await searchProductAsync({
      keyword: "laptop",
      page: 1,
      pageSize: 10,
    });

    console.log(`Tìm thấy: ${searchRes.products.length} sản phẩm:`);
    searchRes.products.forEach((p, idx) => {
      console.log(
        ` ${idx + 1}. [${p.brandName}] ${p.productName} - Giá: ${p.price.toLocaleString()} VNĐ`,
      );
    });

    // 5. Test lọc theo danh mục hoặc giá
    console.log("\n--- KẾT QUẢ TÌM KIẾM: ASUS + Giá > 30tr ---");
    const filterRes = await searchProductAsync({
      brandName: "ASUS",
      minPrice: 30000000,
    });
    console.log(
      `Tìm thấy: ${filterRes.products.length} sản phẩm (Mong đợi: 1):`,
      filterRes.products.map((p) => p.productName),
    );
  } catch (error) {
    console.error("Lỗi trong quá trình chạy test:", error);
  } finally {
    // Đóng kết nối client sau khi test xong
    client.close();
  }
}

runTest();
