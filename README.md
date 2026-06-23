# API-First Development Platform

> Một nền tảng phát triển theo hướng **API-first**, trong đó **API Contract** được xem là **Single Source of Truth**.
>
> Từ một định nghĩa API duy nhất bằng **TypeSpec**, hệ thống tự động sinh backend controller, frontend API client và validation schema, giúp giảm boilerplate, đảm bảo tính đồng nhất giữa frontend và backend, đồng thời cho phép hai phía phát triển độc lập.

> **Lưu ý:** Ứng dụng **E-Commerce** trong repository này chỉ đóng vai trò **Reference Implementation** nhằm kiểm chứng kiến trúc và workflow trên một hệ thống thực tế.

---

# Vấn đề

Trong nhiều dự án thực tế, frontend và backend thường duy trì các định nghĩa API riêng biệt.

Điều này dẫn đến nhiều vấn đề:

* API contract dễ bị sai lệch theo thời gian.
* DTO và validation bị trùng lặp ở nhiều nơi.
* Frontend và backend phải phụ thuộc lẫn nhau trong quá trình phát triển.
* Mỗi khi thêm API mới cần viết nhiều boilerplate code.
* Chi phí bảo trì tăng theo quy mô hệ thống.

---

# Giải pháp

Dự án áp dụng mô hình **Contract-Driven Development**.

API Contract được xem là nguồn dữ liệu duy nhất của toàn bộ hệ thống.

Từ cùng một contract, hệ thống sẽ tự động sinh:

### Backend

* Base Controller
* Route Definition
* Request Validation
* Response Type
* RBAC Metadata
* Public Endpoint Metadata

Developer chỉ cần tập trung vào **Business Logic**.

### Frontend

* API Client
* React Query Hooks
* Request Functions
* Shared TypeScript Types

Frontend không cần viết thủ công các hàm gọi API.

### Shared Package

* TypeScript Types
* Zod Schema
* Request Models
* Response Models

Giúp đảm bảo dữ liệu được đồng bộ giữa frontend và backend.

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

Mọi thành phần còn lại được sinh tự động từ cùng một API Contract.

---

# Kiến trúc

Repository được tổ chức theo mô hình **Monorepo** sử dụng **pnpm workspace**.

```text
packages
├── e-commerce-api          # Backend NestJS (Reference Application)
├── e-commerce-front        # Frontend Next.js (Reference Application)
├── api-client              # Generated React Query Client
├── api-validation          # Shared TypeScript Types & Zod Schema
├── openapi-typespec        # API Contract Definition
├── openapi-generator       # NestJS Code Generator
└── e-commerce-db           # Database Migration
```

Hai package:

* `e-commerce-api`
* `e-commerce-front`

được sử dụng để kiểm chứng kiến trúc trên một bài toán thực tế.

---

# Developer Experience

Ngoài việc sinh code, dự án còn tập trung vào việc giảm thời gian onboarding và tăng hiệu quả phát triển.

Bao gồm:

* VSCode Tasks
* Workspace Configuration
* Environment Setup Scripts
* GitHub Workflow Automation
* Pull Request Helper Scripts
* Database Migration Scripts
* One-command Code Generation

Một developer mới có thể clone project, chạy setup task và bắt đầu phát triển mà không cần thực hiện nhiều bước cấu hình thủ công.

---

# Nguyên tắc thiết kế

## API-First

API Contract là trung tâm của toàn bộ hệ thống.

Mọi thành phần đều được sinh ra từ cùng một nguồn dữ liệu.

---

## Contract-Driven Development

Frontend và backend cùng phát triển dựa trên một API Contract duy nhất.

Điều này giúp giảm sai lệch và hạn chế việc phải đồng bộ thủ công giữa hai phía.

---

## Convention over Configuration

Những phần mang tính lặp lại sẽ được generator xử lý.

Developer chỉ tập trung vào Business Logic.

---

## Developer Experience

Tự động hóa những công việc lặp lại nhằm giảm thời gian onboarding và tăng năng suất phát triển.

---

# Công nghệ sử dụng

## Backend

* NestJS
* Prisma
* PostgreSQL
* Liquibase

## Frontend

* Next.js
* React Query
* Zod

## API Contract

* TypeSpec
* OpenAPI

## Tooling

* Orval
* pnpm Workspace
* Docker
* GitHub CLI

---

# Reference Implementation

Repository sử dụng một hệ thống **E-Commerce SaaS** làm ứng dụng minh họa.

Mục tiêu của dự án không phải xây dựng một website bán hàng hoàn chỉnh, mà là chứng minh rằng kiến trúc API-first, workflow code generation và mô hình Contract-Driven Development có thể áp dụng hiệu quả trên một hệ thống thực tế.
