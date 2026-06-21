# API-First Development Platform

> Một nền tảng phát triển theo hướng **API-first**, trong đó **API Contract** được xem là **Single Source of Truth**. Từ một định nghĩa API duy nhất bằng **TypeSpec**, hệ thống tự động sinh backend controller, frontend API client và validation schema, giúp giảm boilerplate và đảm bảo tính đồng nhất giữa frontend và backend.


> **Lưu ý:** Ứng dụng **E-Commerce** trong repository này chỉ là **ứng dụng minh họa (Reference Implementation)** nhằm chứng minh kiến trúc và workflow hoạt động trên một hệ thống thực tế.

---

# Tại sao dự án này được tạo ra?

Trong nhiều dự án thực tế, frontend và backend thường duy trì các định nghĩa API riêng biệt.

Điều này dẫn đến nhiều vấn đề:

* API contract dễ bị sai lệch.
* DTO và validation bị trùng lặp.
* Frontend và backend phải chờ nhau khi phát triển.
* Mỗi khi thêm API mới phải viết nhiều boilerplate.
* Chi phí bảo trì tăng theo quy mô dự án.

Mục tiêu của dự án là giải quyết những vấn đề trên bằng cách đưa **API Contract** trở thành **nguồn dữ liệu duy nhất** của toàn bộ hệ thống.

---

# Mục tiêu thiết kế

* API Contract là Single Source of Truth.
* Đồng bộ dữ liệu giữa frontend và backend.
* Tự động sinh code thay vì viết thủ công.
* Giảm tối đa boilerplate.
* Cho phép frontend và backend phát triển độc lập.
* Đảm bảo type-safe xuyên suốt hệ thống.
* Tăng trải nghiệm phát triển (Developer Experience).

---

# Kiến trúc

Repository được tổ chức theo mô hình **Monorepo** sử dụng **pnpm workspace**.

```text
packages
├── e-commerce-api          # Backend NestJS (Reference Application)
├── e-commerce-front        # Frontend Next.js (Reference Application)
├── api-client              # React Query Client được sinh tự động
├── api-validation          # Shared TypeScript Types & Zod Schema
├── openapi-typespec        # Định nghĩa API bằng TypeSpec
├── openapi-generator       # Sinh Base Controller cho NestJS
└── e-commerce-db           # Database Migration
```

Hai package `e-commerce-api` và `e-commerce-front` đóng vai trò là ứng dụng minh họa để kiểm chứng kiến trúc.

---

# Workflow

```text
                    TypeSpec Contract
                           │
                           ▼
                     OpenAPI Schema
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
 Backend Generator                    Orval Generator
        │                                     │
        ▼                                     ▼
 Base Controller                  React Query Client
                                  TypeScript Types
                                  Zod Schema
        │                                     │
        └──────────────────┬──────────────────┘
                           ▼
              Backend & Frontend Development
```

Developer chỉ cần định nghĩa API một lần bằng **TypeSpec**.

Các thành phần còn lại sẽ được sinh tự động.

---

# Những gì được sinh tự động

## Backend

* Base Controller
* Route
* Request Validation
* Response Type
* Metadata cho RBAC
* Metadata cho Public Endpoint

Developer chỉ cần triển khai **Business Logic**.

---

## Frontend

* React Query Hooks
* API Client
* Request Function
* Shared TypeScript Types

Frontend không cần viết thủ công các hàm gọi API.

---

## Shared Package

### api-validation

Được sử dụng đồng thời bởi frontend và backend.

Bao gồm:

* TypeScript Types
* Zod Schema
* Request Models
* Response Models

Giúp đảm bảo:

* Đồng bộ kiểu dữ liệu.
* Validation thống nhất.
* Giảm duplicate code.

---

# Developer Experience

Ngoài việc sinh code, project còn tập trung cải thiện trải nghiệm phát triển.

Bao gồm:

* VSCode Tasks.
* Tự động cài đặt môi trường phát triển.
* Workspace được cấu hình sẵn.
* GitHub Workflow Automation.
* Script hỗ trợ tạo Pull Request.
* Database Migration.
* One-command Code Generation.

Một developer mới chỉ cần clone project, chạy task setup và có thể bắt đầu phát triển mà không cần cấu hình thủ công nhiều bước.

---

# Công nghệ sử dụng

## Backend

* NestJS
* Prisma
* PostgreSQL
* Liquibase

## API Contract

* TypeSpec
* OpenAPI

## Frontend

* Next.js
* React Query
* Zod

## Tooling

* pnpm Workspace
* Orval
* OpenAPI Generator
* Docker
* GitHub CLI

---

# Nguyên tắc thiết kế

## API-First

API Contract là trung tâm của toàn bộ hệ thống.

Mọi thành phần đều được sinh ra từ cùng một nguồn dữ liệu.

---

## Contract-Driven Development

Frontend và backend cùng phát triển dựa trên một API Contract duy nhất, hạn chế tối đa việc sai lệch giữa hai phía.

---

## Convention over Configuration

Những phần mang tính lặp lại sẽ được generator xử lý.

Developer chỉ tập trung vào Business Logic.

---

## Developer Experience

Tự động hóa những công việc lặp lại để tăng năng suất phát triển và giảm thời gian onboarding.

---

# Ứng dụng minh họa

Repository sử dụng một hệ thống **E-Commerce SaaS** làm **Reference Implementation**.

Mục tiêu không phải xây dựng một website bán hàng hoàn chỉnh, mà là chứng minh rằng kiến trúc, workflow và hệ thống code generation có thể áp dụng hiệu quả trên một bài toán thực tế.
