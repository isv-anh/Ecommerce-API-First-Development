---
name: api-design
description: Hướng dẫn thiết kế API bằng TypeSpec (openapi-typespec), biên dịch sang OpenAPI JSON và cấu trúc tệp tin thiết kế API.
---

## 1. Tổng quan (Overview)

Tài liệu này hướng dẫn quy trình thiết kế API sử dụng **TypeSpec** trong package `packages/openapi-typespec`. TypeSpec là một ngôn ngữ thiết kế API hiện đại được phát triển bởi Microsoft, giúp định nghĩa các hợp đồng API (API Contracts) một cách ngắn gọn, kiểu an toàn (type-safe) và có tính tái sử dụng cao. Hợp đồng này sau đó được biên dịch thành đặc tả OpenAPI 3.0 làm Single Source of Truth cho toàn bộ dự án.

---

## 2. Cấu trúc thư mục API Design

Dự án thiết kế API được tổ chức theo module cụ thể nằm trong `packages/openapi-typespec/src`:

```text
packages/openapi-typespec/src/
├── common/                # Các thành phần dùng chung (lỗi, scalar, versions)
│   ├── enums/
│   │   └── versions.tsp   # Định nghĩa các phiên bản API
│   ├── models/
│   │   └── errors.tsp     # Các mô hình lỗi dùng chung (BadRequestError, vv.)
│   └── scalars/
│       └── scalars.tsp    # Kiểu dữ liệu tùy chỉnh (ví dụ: UUID)
├── cart/                  # Module giỏ hàng (Cart) làm ví dụ mẫu
│   ├── cart-items/        # Các API liên quan tới cart-items
│   │   ├── models.tsp     # Model dữ liệu của cart-items
│   │   └── routes.tsp     # Các API route của cart-items
│   ├── carts/             # Các API liên quan tới carts
│   │   ├── models.tsp     # Model dữ liệu của carts
│   │   └── routes.tsp     # Các API route của carts
│   └── main.tsp           # Điểm vào (entry point) của module Cart
```

---

## 3. Quy tắc viết mã TypeSpec (.tsp)

### 3.1. Điểm vào của Module (`main.tsp`)
File `main.tsp` đóng vai trò là nơi liên kết, import tất cả các route và khai báo các thông tin cấu hình chung của dịch vụ (tiêu đề, phiên bản, route phiên bản):

```typespec
import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./carts/routes.tsp";
import "./cart-items/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Cart API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Cart;
```

### 3.2. Thiết kế Models (`models.tsp`)
Được dùng để định nghĩa cấu trúc dữ liệu gửi lên (Request) và nhận về (Response).
- Sử dụng `@example` để minh họa dữ liệu mẫu giúp tài liệu sinh ra trực quan hơn.
- Định nghĩa rõ các kiểu dữ liệu như `UUID`, `string`, `int32`, mảng `Type[]`.
- Khai báo rõ ràng mã trạng thái HTTP bằng decorator `@statusCode` và nội dung response bằng `@body`.

*Ví dụ về Models:*
```typespec
import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    cartId: "123e4567-e89b-12d3-a456-426614174400",
    userId: "123e4567-e89b-12d3-a456-426614174500",
    updatedAt: "2026-04-09T08:00:00.000Z",
})
model CartResponse {
    cartId: UUID;
    userId: UUID;
    updatedAt: string;
}

model GetCartResponse200 {
    @statusCode statusCode: 200;
    @body body: CartResponse;
}
```

### 3.3. Thiết kế Routes (`routes.tsp`)
Nơi định nghĩa các đường dẫn (endpoints) và ánh xạ chúng với các phương thức HTTP.
- Sử dụng các decorator như `@route`, `@get`, `@post`, `@patch`, `@delete`.
- Gán `@operationId` duy nhất cho mỗi API để sinh mã nguồn ở Client/Server chính xác hơn.
- Phân nhóm bằng `@tag` để dễ dàng quản lý tài liệu trên Swagger.
- Chỉ định các tham số đầu vào bằng `@path` (path parameters), `@query` (query parameters), `@body` (request body).
- Trả về mã thành công hoặc mã lỗi dùng chung (ví dụ: `BadRequestError | InternalServerError`).

*Ví dụ về Routes:*
```typespec
import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/carts")
namespace Cart.Carts {
    @get
    @route("")
    @operationId("getCart")
    @tag("carts")
    op getCart(
        @query userId: UUID,
    ): GetCartResponse200 | BadRequestError | InternalServerError;
}
```

---

## 4. Biên dịch TypeSpec thành OpenAPI JSON

Sau khi bạn đã hoàn thành thiết kế các file `.tsp`, bạn cần chạy biên dịch (compile) để sinh đặc tả OpenAPI 3.0 dưới dạng file JSON.

Chạy lệnh sau tại thư mục root của dự án:
```bash
pnpm run generate:open-api
```
Lệnh này sẽ thực thi script biên dịch toàn bộ các thư mục con trong `packages/openapi-typespec/src/` (ngoại trừ `common`) và xuất các file JSON kết quả vào thư mục `docs/openapi/` (ví dụ: `docs/openapi/cart.json`).

Bạn cũng có thể chạy lệnh trực tiếp bằng bộ lọc filter của pnpm:
```bash
pnpm --filter openapi-typespec generate
```

---

## 5. Ví dụ thực tế: Module Cart (`/packages/openapi-typespec/src/cart`)

Dưới đây là tập hợp mã nguồn hoàn chỉnh của module Cart dùng làm mẫu tham chiếu:

### 5.1. Cart Items Models (`cart-items/models.tsp`)
```typespec
import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    cartId: "123e4567-e89b-12d3-a456-426614174400",
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    quantity: 2,
})
model CartItemResponse {
    cartId: UUID;
    productVariantId: UUID;
    quantity: int32;
}

model PostCartItemRequestBody {
    productVariantId: UUID;
    quantity?: int32;
}

model PostCartItemResponseBody {
    cartId: UUID;
    productVariantId: UUID;
}

model PatchCartItemRequestBody {
    quantity?: int32;
}

model CartItemsResponse {
    cartItems: CartItemResponse[];
}

model GetCartItemsResponse200 {
    @statusCode statusCode: 200;
    @body body: CartItemsResponse;
}

model PostCartItemResponse {
    @statusCode statusCode: 201;
    @body body: PostCartItemResponseBody;
}

model PatchCartItemResponse {
    @statusCode statusCode: 204;
}

model DeleteCartItemResponse {
    @statusCode statusCode: 204;
}
```

### 5.2. Cart Items Routes (`cart-items/routes.tsp`)
```typespec
import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/carts")
namespace Cart.CartItems {
    @get
    @route("/{cartId}/items")
    @operationId("getCartItems")
    @tag("cart-items")
    op getCartItems(
        @path cartId: UUID,
    ): GetCartItemsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{cartId}/items")
    @operationId("postCartItem")
    @tag("cart-items")
    op postCartItem(
        @path cartId: UUID,
        @body body: PostCartItemRequestBody,
    ): PostCartItemResponse | BadRequestError | InternalServerError;

    @patch
    @route("/{cartId}/items/{productVariantId}")
    @operationId("patchCartItem")
    @tag("cart-items")
    op patchCartItem(
        @path cartId: UUID,
        @path productVariantId: UUID,
        @body body: PatchCartItemRequestBody,
    ): PatchCartItemResponse | BadRequestError | InternalServerError;

    @delete
    @route("/{cartId}/items/{productVariantId}")
    @operationId("deleteCartItem")
    @tag("cart-items")
    op deleteCartItem(
        @path cartId: UUID,
        @path productVariantId: UUID,
    ): DeleteCartItemResponse | BadRequestError | InternalServerError;
}
```

---

## 6. Quy tắc thiết kế API quan trọng
1. ⚠️ **Luôn sử dụng `UUID` cho các định danh khóa chính** (như `cartId`, `userId`, `productVariantId`) để đảm bảo tính duy nhất và an toàn.
2. ⚠️ **Tuân thủ mã trạng thái HTTP chuẩn**:
   - `200 OK`: Khi truy vấn thành công dữ liệu và trả về body.
   - `201 Created`: Khi tạo mới thành công tài nguyên và trả về thông tin định danh của tài nguyên vừa tạo.
   - `204 No Content`: Khi thao tác cập nhật (PATCH/PUT) hoặc xóa (DELETE) thành công và không cần trả về body.
3. ⚠️ **Sử dụng `@operationId` có ý nghĩa**: Tên operation viết theo chuẩn camelCase (ví dụ: `getCartItems`, `postCartItem`). Tên này sẽ ảnh hưởng trực tiếp đến tên hàm được sinh ra ở client và backend controller.
4. ⚠️ **Bảo toàn tính nhất quán**: Sử dụng các mô hình lỗi chuẩn như `BadRequestError`, `NotFoundError`, `InternalServerError` được định nghĩa trong `common/models/errors.tsp`.
5. ⚠️ **Khai báo API công khai (Public)**: Đối với các API công khai không yêu cầu xác thực người dùng, cần thêm decorator `@extension("x-public", true)` trước phương thức định nghĩa (ví dụ: login, register).

