# E-Commerce SaaS

## Tổng quan

E-Commerce là hệ thống SaaS hỗ trợ người dùng xây dựng và vận hành nền tảng mua bán trực tuyến một cách thuận tiện, linh hoạt và dễ mở rộng.

Hệ thống được thiết kế theo hướng:

* API-first
* Type-safe
* Tự động sinh code
* Đồng bộ schema giữa frontend và backend
* Tăng tốc phát triển bằng AI và automation

---

# Triết lý phát triển

## Học tập với AI

AI được sử dụng để:

* Tìm hiểu kiến thức mới
* Tăng tốc quá trình phát triển
* Hỗ trợ phân tích và sinh code

Tuy nhiên:

* Luôn kiểm tra lại kết quả mà AI tạo ra
* Không phụ thuộc hoàn toàn vào AI
* Ưu tiên hiểu bản chất thay vì copy trực tiếp

---

## YAGNI

Áp dụng nguyên tắc **YAGNI (You Aren't Gonna Need It)**:

* Chỉ xây dựng những gì thực sự cần
* Tránh over-engineering
* Ưu tiên sự đơn giản và khả năng bảo trì
* Tối ưu tốc độ phát triển sản phẩm

---

# Kiến trúc hệ thống

Hệ thống được tổ chức theo mô hình **Monorepo** và quản lý bằng `pnpm workspace`.

## Cấu trúc thư mục

```txt
packages
├─ e-commerce-api/          # Backend API (NestJS)
├─ e-commerce-front/        # Frontend (Next.js)
├─ api-client/              # Orval generated React Query client
├─ api-validation/          # Shared API types & Zod schema dùng cho frontend và backend
├─ openapi-typespec/        # Định nghĩa OpenAPI bằng TypeSpec
├─ openapi-generator/       # Generate base controller cho backend
└─ e-commerce-db/           # Database migration với Liquibase
```

---

# Workflow

```txt
                     openapi-typespec
                              │
                              ▼
                         openapi.json
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
   openapi-generator                      orval generator
          │                                       │
          ▼                                       ▼
   Base Controller                  ┌─────────────┴─────────────┐
          │                         │                           │
          ▼                         ▼                           ▼
  e-commerce-api               api-client                api-validation
                                     │                           │
                                     ▼                           │
                             React Query Hooks                   │
                                     │                           │
                                     └─────────────┬─────────────┘
                                                   │
                             ┌─────────────────────┴─────────────────────┐
                             ▼                                           ▼
                     e-commerce-front                           e-commerce-api
```


---

# Vai trò của các package

## openapi-typespec

Định nghĩa API contract bằng TypeSpec và sinh ra `openapi.json`.

---

## api-client

Sinh tự động:

* API client
* React Query hooks
* Request function

Frontend chỉ cần gọi hooks thay vì tự viết fetch logic.

---

## api-validation

Chứa:

* Shared API types
* Zod schema
* Request/response validation

Được sử dụng cho cả:

* Frontend
* Backend

Giúp đảm bảo:

* Đồng bộ type
* Validate dữ liệu thống nhất
* Giảm duplicate schema

---

## openapi-generator

Sinh base controller cho backend từ OpenAPI schema nhằm:

* Giảm boilerplate code
* Đồng bộ contract với backend implementation

---

## e-commerce-db

Quản lý database migration bằng Liquibase.

---

# Công nghệ sử dụng

## Backend

* NestJS
* OpenAPI
* TypeSpec
* Liquibase

## Frontend

* Next.js
* React Query
* Zod

## Tooling

* pnpm workspace
* Orval
* OpenAPI Generator

---

# Mục tiêu kiến trúc

* Đồng bộ type giữa frontend và backend
* Tự động sinh API client
* Chia sẻ validation schema
* Giảm code lặp
* Dễ mở rộng
* Dễ bảo trì
* Tăng tốc phát triển tính năng
* Hạn chế sai lệch API contract


---

# Vai trò của các package

## openapi-typespec

Định nghĩa API contract bằng TypeSpec và sinh ra `openapi.json`.

---

## api-client

Sinh tự động:

* API client
* React Query hooks
* Request function

Frontend chỉ cần gọi hooks thay vì tự viết fetch logic.

---

## api-validation

Chứa:

* Shared API types
* Zod schema
* Request/response validation

Được sử dụng cho cả:

* Frontend
* Backend

Giúp đảm bảo:

* Đồng bộ type
* Validate dữ liệu thống nhất
* Giảm duplicate schema

---

## openapi-generator

Sinh base controller cho backend từ OpenAPI schema nhằm:

* Giảm boilerplate code
* Đồng bộ contract với backend implementation

---

## e-commerce-db

Quản lý database migration bằng Liquibase.

---

# Công nghệ sử dụng

## Backend

* NestJS
* OpenAPI
* TypeSpec
* Liquibase

## Frontend

* Next.js
* React Query
* Zod

## Tooling

* pnpm workspace
* Orval
* OpenAPI Generator

---

# Mục tiêu kiến trúc

* Đồng bộ type giữa frontend và backend
* Tự động sinh API client
* Chia sẻ validation schema
* Giảm code lặp
* Dễ mở rộng
* Dễ bảo trì
* Tăng tốc phát triển tính năng
* Hạn chế sai lệch API contract
