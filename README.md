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


# Chạy production bằng Docker Compose

`docker-compose.prod.yaml` chạy 5 service: `frontend`, `api`, `order`, `search`,
`ai-assistant`. PostgreSQL dùng Supabase; RabbitMQ và Elasticsearch dùng cloud.

```bash
cp .env.production.example .env.production
# Điền thông tin Supabase, RabbitMQ, Elasticsearch, JWT, AWS, SendGrid và DashScope.
docker compose --env-file .env.production -f docker-compose.prod.yaml config --quiet
docker compose --env-file .env.production -f docker-compose.prod.yaml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yaml ps
docker compose --env-file .env.production -f docker-compose.prod.yaml logs -f
```

Dùng `--env-file .env.production` để Compose đọc các biến `${...}`; xem
[tài liệu Docker về interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/).
Giữ `.env.production` ở máy triển khai, không commit. Nếu mật khẩu chứa `$`,
đặt giá trị trong dấu nháy đơn trong file env để tránh nội suy.

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: lấy từ mục
  **Connect** của Supabase, dùng direct connection hoặc session pooler. Kết nối
  Node sử dụng TLS qua `PGSSLMODE=require`.
- `DB_URI`: URI PostgreSQL riêng cho checkpoint của AI, thêm `sslmode=require`
  và URL-encode username/password khi có ký tự đặc biệt. AI tự tạo bảng checkpoint
  khi khởi động, nên tài khoản này cần quyền tạo bảng trong schema sử dụng.
- `RABBITMQ_URL`: URL cloud dạng `amqps://...`, bao gồm virtual host đúng.
- Elasticsearch: điền `ELASTIC_CLOUD_ID` hoặc `ELASTICSEARCH_NODE` (HTTPS), kèm
  `ELASTIC_API_KEY` hoặc `ELASTIC_USERNAME` / `ELASTIC_PASSWORD`.
- `FRONTEND_URL`: origin công khai của frontend cho CORS, không thêm dấu `/` cuối.
- `NEXT_PUBLIC_API_URL`: URL API mà trình duyệt truy cập được. Giá trị này được
  nhúng khi build, nên cần build lại frontend sau khi đổi. SSR dùng `http://api:8080`.

Mặc định host mở frontend ở cổng `3000` và API ở `8080`; đổi bằng `FRONTEND_PORT`
và `API_PORT`. Trỏ domain HTTPS / reverse proxy của máy triển khai về các cổng
này. Các cổng gRPC `50051`–`50054` chỉ dùng trong mạng Docker. Healthcheck kiểm tra
cổng lắng nghe; không thay thế kiểm tra từng chức năng hay kết nối cloud.

Build image cần Internet để tải dependency và sinh protobuf từ Buf. API tự sinh
Prisma Client và base controller trong build, không cần truyền secret production
vào image.


Image `api` và `order` dùng [Node.js distroless](https://github.com/GoogleContainerTools/distroless/tree/main/nodejs)
và [dependency tracing](https://github.com/vercel/nft) qua `docker/node-runtime/trace.mjs`.
Image cuối chỉ chứa code đã build và file runtime cần thiết; Prisma CLI, Studio,
TypeScript, npm và pnpm nằm ngoài image chạy. Prisma WASM, bcrypt và gRPC được
kiểm tra trong image. Distroless không có shell: dùng `logs` để xem lỗi hoặc
`docker compose ... exec api node ...` để chạy lệnh Node.js. Healthcheck hiện tại
vẫn chạy qua `node` trong `PATH`.

Nếu schema Supabase đã được migrate, chỉ cần lệnh `up` ở trên. Khi cần cập nhật
schema, chạy Liquibase riêng trước khi triển khai ứng dụng:

```bash
# Điền ADMIN_PASSWORD trong .env.production trước khi chạy migration.
docker compose --env-file .env.production -f docker-compose.prod.yaml --profile migration run --rm liquibase
```

Liquibase dùng `DB_*` với TLS; có thể đặt `LIQUIBASE_URL` để đổi JDBC URL. Profile
`migration` không chạy trong lệnh `up` thông thường. Migration thất bại cần xử lý
trước khi cập nhật các container ứng dụng.
