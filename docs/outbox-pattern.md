# Outbox pattern trong dự án

Tài liệu mô tả implementation hiện tại: API ghi thay đổi sản phẩm và sự kiện vào cùng transaction PostgreSQL; một cron job đọc sự kiện từ bảng `outbox_events` và phát sang RabbitMQ; Search Service nhận sự kiện để cập nhật Elasticsearch.

Outbox hiện phục vụ đồng bộ **sản phẩm sang chỉ mục tìm kiếm**. Các thao tác tạo/hủy đơn hàng, cập nhật tồn kho, biến thể, danh mục hoặc thương hiệu chưa có luồng ghi outbox riêng trong mã nguồn được khảo sát.

## 1. Vì sao cần outbox?

Một lần cập nhật sản phẩm có hai việc cần thực hiện: lưu dữ liệu nghiệp vụ vào PostgreSQL và thông báo cho Search Service cập nhật Elasticsearch. Nếu API ghi database rồi phát RabbitMQ trực tiếp, tiến trình có thể dừng giữa hai bước: sản phẩm đã thay đổi nhưng sự kiện chưa được gửi.

Dự án đưa việc ghi sự kiện vào cùng transaction với thay đổi sản phẩm. Khi transaction commit, cả dữ liệu sản phẩm và bản ghi sự kiện đều tồn tại. Nếu transaction lỗi, cả hai cùng rollback. API không cần chờ RabbitMQ hoặc Elasticsearch xử lý xong mới hoàn tất thao tác lưu sản phẩm.

Điều được bảo đảm ở đây là **ghi dữ liệu nghiệp vụ và ghi sự kiện một cách nguyên tử trong PostgreSQL**. Việc chuyển sự kiện đến broker và cập nhật Elasticsearch diễn ra sau đó, với các giới hạn mô tả ở phần 7.

## 2. Các thành phần

| Thành phần | Vai trò | Mã nguồn |
| --- | --- | --- |
| `ProductsRepository` | Ghi sản phẩm và sự kiện trong cùng transaction | [products.repository.ts](../packages/e-commerce-api/src/api/v1/product/products/products.repository.ts) |
| `outbox_events` | Lưu sự kiện đang chờ và đã phát | [schema.prisma](../packages/e-commerce-api/prisma/schema.prisma), [Liquibase migration](../packages/e-commerce-db/changelog/product/z_outbox.changelog.yaml) |
| `OutboxProcessorService` | Đọc sự kiện `PENDING` mỗi 5 giây | [outbox-processor.service.ts](../packages/e-commerce-api/src/api/v1/product/outbox/outbox-processor.service.ts) |
| `RabbitMQService` | Phát sự kiện lên exchange `product_events` | [rabbitmq.service.ts](../packages/e-commerce-api/src/common/services/rabbitmq.service.ts) |
| Search consumer | Nhận sự kiện từ queue `search_product_sync_queue` | [rabbitmq.ts](../packages/e-commerce-search/src/rabbitmq.ts) |
| `updateProduct` | Tạo embedding và ghi document Elasticsearch | [handlers/product.ts](../packages/e-commerce-search/src/handlers/product.ts) |

Cron chạy bên trong API NestJS, không phải worker triển khai riêng. [AppModule](../packages/e-commerce-api/src/app.module.ts) đăng ký `ScheduleModule.forRoot()` và `OutboxModule`; [OutboxModule](../packages/e-commerce-api/src/api/v1/product/outbox/outbox.module.ts) đăng ký processor, RabbitMQ service và Prisma.

```mermaid
flowchart LR
    Request[Thao tác sản phẩm] --> Repo[ProductsRepository]
    Repo --> Tx[Transaction PostgreSQL]
    Tx --> Products[(products và product_images)]
    Tx --> Outbox[(outbox_events: PENDING)]
    Outbox --> Cron[Cron trong API: mỗi 5 giây]
    Cron --> Exchange[RabbitMQ: product_events]
    Exchange --> Queue[search_product_sync_queue]
    Queue --> Consumer[Search consumer]
    Consumer --> Embedding[Tạo embedding]
    Embedding --> ES[(Elasticsearch: products)]
    Cron --> Done[(outbox_events: PROCESSED)]
```

Nhánh đánh dấu `PROCESSED` hiện dựa trên giá trị trả về của `channel.publish()`, không đợi consumer cập nhật Elasticsearch.

## 3. Ghi sự kiện cùng dữ liệu sản phẩm

Ba phương thức trong `ProductsRepository` đang phát sinh sự kiện:

| Phương thức | Thay đổi trong transaction | `event_type` | Payload |
| --- | --- | --- | --- |
| `createProduct` | Tạo sản phẩm và ảnh nếu có | `created` | Snapshot sản phẩm kèm `categories`, `brands`, `product_images` |
| `updateProduct` | Cập nhật trường sản phẩm và thêm/xóa ảnh theo diff | `updated` | Snapshot sau cập nhật, kèm các quan hệ trên |
| `deleteProduct` | Xóa sản phẩm | `deleted` | `{ productId }` |

Mỗi sự kiện có UUID riêng từ `crypto.randomUUID()`, `aggregate_type = 'product'` và `aggregate_id` là ID sản phẩm. Bản ghi được tạo qua `tx.outbox_events.create()`, sử dụng cùng đối tượng transaction `tx` với thao tác sản phẩm.

Ví dụ rút gọn của luồng cập nhật:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.products.update({ /* dữ liệu sản phẩm */ });
  // Cập nhật ảnh, rồi đọc snapshot sản phẩm sau thay đổi.
  await tx.outbox_events.create({
    data: {
      id: crypto.randomUUID(),
      aggregate_type: 'product',
      aggregate_id: productId,
      event_type: 'updated',
      payload: updatedProduct,
    },
  });
});
```

Đây là mã minh họa rút gọn; implementation đầy đủ nằm trong repository được liên kết ở trên. Payload là snapshot lúc ghi sự kiện, không phải dữ liệu được đọc lại khi cron phát message.

### Cấu trúc bảng `outbox_events`

| Cột | Ý nghĩa |
| --- | --- |
| `id` | UUID của sự kiện, khóa chính |
| `aggregate_type` | Loại thực thể; hiện là `product` |
| `aggregate_id` | ID thực thể bị thay đổi |
| `event_type` | `created`, `updated` hoặc `deleted` |
| `payload` | Snapshot hoặc dữ liệu sự kiện, kiểu `jsonb` |
| `status` | Mặc định `PENDING`; processor đổi thành `PROCESSED` |
| `created_at` | Thời điểm tạo sự kiện, mặc định thời gian database |

Bảng hiện chưa có `processed_at`, số lần thử, lỗi gần nhất, thời điểm retry tiếp theo, phiên bản sự kiện hoặc thông tin worker đang giữ sự kiện. Migration chưa khai báo index riêng cho truy vấn theo `status` và `created_at`.

## 4. Processor phát sự kiện sang RabbitMQ

`processOutboxEvents()` chạy mỗi **5 giây** và thực hiện:

1. Kiểm tra cờ `isProcessing`. Nếu lượt trước còn chạy trong cùng instance, bỏ qua lượt cron mới.
2. Lấy tối đa **50** bản ghi có `status = 'PENDING'`, sắp theo `created_at ASC`.
3. Phát từng bản ghi tuần tự. Routing key được tạo bằng `product.${event.event_type.toLowerCase()}`.
4. Nếu hàm `publish()` trả `true`, đổi bản ghi thành `PROCESSED`.
5. Nếu trả `false`, giữ nguyên `PENDING`, ghi log lỗi và tiếp tục vòng lặp. Sự kiện được lấy lại ở lượt cron sau.
6. Nếu phát sinh exception, ghi log và kết thúc lượt xử lý. Khối `finally` đặt lại `isProcessing`.

Envelope gửi lên RabbitMQ có dạng:

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "aggregateType": "product",
  "aggregateId": "123e4567-e89b-12d3-a456-426614174001",
  "eventType": "updated",
  "payload": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Áo polo",
    "description": "Áo polo cotton",
    "thumbnail_url": "/products/polo.png",
    "slug": "ao-polo",
    "categories": { "name": "Áo" },
    "brands": { "name": "Thương hiệu mẫu" },
    "product_images": []
  },
  "timestamp": "2026-10-05T08:00:00.000Z"
}
```

Ví dụ đã lược bớt trường trong snapshot. `timestamp` lấy từ `created_at` và được serialize sang JSON. `eventId` được gửi đi nhưng consumer hiện chưa dùng để chống xử lý trùng.

### Cấu hình broker

| Thuộc tính | Giá trị trong code |
| --- | --- |
| URL kết nối | `RABBITMQ_URL`, mặc định `amqp://guest:guest@localhost:5672` |
| Exchange | `product_events` |
| Exchange type | `topic` |
| Exchange durable | `true` |
| Routing keys | `product.created`, `product.updated`, `product.deleted` |
| Message persistent | `true` |
| Search queue | `search_product_sync_queue`, durable |
| Binding | `product.#` |

Publisher khai báo exchange; Search consumer khai báo queue và binding. Vì vậy, queue cần được tạo và bind trước khi phát sự kiện để sự kiện có nơi được định tuyến đến.

## 5. Search Service xử lý sự kiện

[server.ts](../packages/e-commerce-search/src/server.ts) chuẩn bị Elasticsearch trước, sau đó khởi tạo RabbitMQ consumer.

Với sự kiện `created` hoặc `updated` của aggregate `product`, consumer:

1. Parse message JSON và đọc `event.payload`.
2. Chuyển tên trường từ snapshot PostgreSQL sang model tìm kiếm: `id → productId`, `name → productName`, `thumbnail_url → thumbnailUrl`, tên danh mục/thương hiệu từ các quan hệ.
3. Gọi `updateProduct()`. Handler tạo embedding từ tên, danh mục, thương hiệu và mô tả, rồi gọi `esClient.index()` vào index `products`, dùng `productId` làm document ID.
4. Gọi `channel.ack(msg)` sau khi handler hoàn tất.

Consumer đang lấy giá bằng `p.product_variants?.[0]?.price || 0`, nhưng snapshot tạo/cập nhật sản phẩm **không include `product_variants`**. Vì vậy, giá trong document được đồng bộ qua luồng này hiện thường là `0`. Cập nhật biến thể riêng cũng chưa tạo sự kiện outbox.

Với sự kiện `deleted`, consumer chỉ ghi log TODO và **ack message**, chưa xóa document khỏi Elasticsearch. Sản phẩm đã xóa trong PostgreSQL vì vậy có thể vẫn xuất hiện trong kết quả tìm kiếm.

Nếu parse JSON, tạo embedding hoặc ghi Elasticsearch lỗi, consumer gọi:

```typescript
channel.nack(msg, false, false);
```

Tham số cuối là `requeue = false`. Code hiện không khai báo dead-letter exchange hoặc retry queue; nếu broker cũng không có policy dead-letter từ bên ngoài, message bị loại khỏi queue thay vì được thử lại. Outbox đã `PROCESSED` không tự quay về `PENDING` khi consumer thất bại.

## 6. Ví dụ luồng cập nhật thành công

```mermaid
sequenceDiagram
    participant API as API / ProductsRepository
    participant DB as PostgreSQL
    participant Cron as OutboxProcessor
    participant MQ as RabbitMQ
    participant Search as Search consumer
    participant ES as Elasticsearch
    API->>DB: BEGIN transaction
    API->>DB: Cập nhật sản phẩm và ảnh
    API->>DB: INSERT outbox_events, status PENDING
    API->>DB: COMMIT
    API-->>API: Hoàn tất thao tác sản phẩm
    Cron->>DB: SELECT tối đa 50 sự kiện PENDING
    Cron->>MQ: channel.publish(product.updated)
    Note over Cron,MQ: Boolean trả về phản ánh buffer gửi, không phải broker confirm
    Cron->>DB: UPDATE status PROCESSED nếu publish trả true
    MQ->>Search: Deliver message
    Search->>Search: Parse snapshot và tạo embedding
    Search->>ES: Index document với ID sản phẩm
    ES-->>Search: Kết quả index
    Search->>MQ: ACK
```

Thời gian cập nhật tìm kiếm gồm thời gian chờ cron, backlog, truyền message, tạo embedding, index và refresh Elasticsearch. Chu kỳ 5 giây không phải cam kết độ trễ tối đa. Handler không yêu cầu `refresh: true`, nên ACK cũng không đồng nghĩa document đã lập tức nhìn thấy qua search.

## 7. Bảo đảm và giới hạn hiện tại

| Tình huống | Hành vi hiện tại |
| --- | --- |
| Transaction sản phẩm thất bại | Thay đổi sản phẩm và sự kiện cùng rollback |
| Commit xong, API dừng trước khi cron chạy | Sự kiện còn `PENDING` trong database; processor có thể đọc khi API chạy lại |
| Chưa có channel hoặc publish ném lỗi | `publish()` trả `false`; sự kiện giữ `PENDING` để thử lại |
| Broker nhận message nhưng API dừng trước khi cập nhật outbox | Sự kiện có thể được phát lại và consumer nhận trùng |
| Publish trả `true`, nhưng broker chưa nhận/lưu được message | Outbox có thể đã `PROCESSED` dù message chưa được lưu ở broker |
| Exchange chưa có queue/binding phù hợp | Publisher không bật `mandatory` hoặc xử lý returned message; sự kiện có thể không đến queue và vẫn bị đánh dấu `PROCESSED` |
| Consumer tạo embedding/index lỗi | NACK không requeue; không có retry/DLQ được khai báo trong code |
| Consumer chết trước ACK | Message chưa ACK có thể được broker giao lại; consumer chưa có cơ chế deduplicate |
| Hai API instance chạy processor cùng lúc | Cờ `isProcessing` không chia sẻ giữa các instance; cả hai có thể đọc và phát cùng sự kiện |
| Hai cập nhật cùng sản phẩm hoàn tất khác thứ tự | Consumer không kiểm tra version; snapshot cũ có thể ghi đè snapshot mới |

### `publish()` chưa phải publisher confirm

`RabbitMQService` dùng `createChannel()`, không dùng `createConfirmChannel()`. Boolean từ `channel.publish()` phản ánh khả năng tiếp tục ghi vào buffer của client. `false` biểu thị backpressure và không có nghĩa message chắc chắn chưa được gửi; retry có thể tạo bản sao. `true` cũng không phải xác nhận broker đã nhận hoặc lưu bền vững message.

Các tùy chọn `durable: true` và `persistent: true` được cấu hình, nhưng không thay thế publisher confirm. Vì vậy, implementation hiện tại **chưa bảo đảm giao sự kiện ít nhất một lần xuyên suốt đến Elasticsearch**, và cũng không có bảo đảm exactly-once.

### Thứ tự và xử lý trùng

Processor đọc theo `created_at ASC` và phát tuần tự trong một lượt, nhưng chưa có khóa claim bằng database, chưa có thứ tự phụ khi timestamp bằng nhau và chưa tuần tự hóa theo sản phẩm giữa nhiều instance. Consumer chưa cấu hình `prefetch` hay hàng đợi xử lý riêng; callback bất đồng bộ có thể xử lý nhiều message đồng thời.

Index theo cùng `productId` giúp message trùng ghi vào cùng document thay vì tạo document ID mới. Tuy nhiên, handler vẫn tạo embedding lại mỗi lần, và thiếu version khiến cập nhật cũ có thể ghi đè dữ liệu mới. Đây chưa phải cơ chế idempotency đầy đủ.

### Phạm vi snapshot

Snapshot hiện include danh mục, thương hiệu và ảnh nhưng không include biến thể. Việc sửa tên danh mục/thương hiệu, giá biến thể, ảnh qua repository khác hoặc tồn kho không tự ghi sự kiện outbox của sản phẩm. Snapshot cũng chưa được consumer kiểm tra `is_published` trước khi index.

## 8. Kiểm tra khi dữ liệu tìm kiếm chưa cập nhật

Các truy vấn sau chỉ đọc dữ liệu PostgreSQL:

```sql
-- Số sự kiện theo trạng thái.
SELECT status, COUNT(*) AS event_count
FROM outbox_events
GROUP BY status;

-- Sự kiện đang chờ lâu nhất.
SELECT id, aggregate_id, event_type, created_at,
       CURRENT_TIMESTAMP - created_at AS pending_age
FROM outbox_events
WHERE status = 'PENDING'
ORDER BY created_at ASC
LIMIT 50;

-- Lịch sử sự kiện của một sản phẩm; thay UUID bằng ID cần kiểm tra.
SELECT id, event_type, status, created_at, payload
FROM outbox_events
WHERE aggregate_id = '123e4567-e89b-12d3-a456-426614174001'
ORDER BY created_at ASC;
```

Nếu `PENDING` tăng hoặc tuổi sự kiện tăng, kiểm tra API có chạy cron không, log `OutboxProcessorService`, log kết nối `RabbitMQService` và `RABBITMQ_URL`. Khi kết nối publisher thất bại lúc khởi tạo, code lên lịch kết nối lại sau 5 giây; publisher cũng đăng ký handler `error`/`close` để kết nối lại.

Nếu outbox đã `PROCESSED` nhưng Elasticsearch chưa đúng, kiểm tra queue `search_product_sync_queue`, binding `product.#`, consumer, log `Error processing RabbitMQ message`, cấu hình Elasticsearch và dịch vụ tạo embedding. `PROCESSED` không phải bằng chứng Search Service đã xử lý thành công. Consumer hiện chỉ lên lịch retry khi hàm khởi tạo kết nối lỗi; chưa đăng ký cơ chế reconnect cho connection bị đóng sau khi đã kết nối.

[scripts/sync-elasticsearch.js](../scripts/sync-elasticsearch.js), chạy bằng `pnpm run sync:es`, là luồng đồng bộ trực tiếp từ PostgreSQL sang Elasticsearch. Script này không đọc outbox, không đổi trạng thái outbox và không dọn document của sản phẩm đã bị xóa. Script có thể ghi lại dữ liệu sản phẩm hiện có; cần tính đến các cập nhật từ consumer đang chạy khi sử dụng để phục hồi chỉ mục.

## 9. Các bước hoàn thiện tiếp theo

Các mục dưới đây là đề xuất, **chưa được triển khai trong luồng đang mô tả**:

1. Dùng confirm channel, chờ broker confirm trước khi đổi `PROCESSED`; xử lý backpressure và message không được định tuyến.
2. Claim sự kiện bằng khóa database hoặc cơ chế lease để nhiều API instance không cùng phát một bản ghi.
3. Thêm version theo sản phẩm và kiểm tra version phía Elasticsearch; dùng `eventId` để hỗ trợ deduplicate.
4. Thiết lập retry có backoff và dead-letter queue cho lỗi consumer; lưu thông tin lỗi để quan sát và phát lại có kiểm soát.
5. Xử lý `deleted` bằng xóa document và giữ thông tin phiên bản xóa để sự kiện cũ không khôi phục sản phẩm đã xóa.
6. Chuẩn hóa payload, include giá/biến thể cần thiết, xử lý trạng thái xuất bản và phát sự kiện khi dữ liệu liên quan thay đổi.
7. Thêm index phục vụ đọc `PENDING`, thông tin số lần thử/thời gian xử lý, metrics backlog và chính sách dọn sự kiện `PROCESSED`.

Khi bổ sung một thao tác nghiệp vụ mới vào outbox, cần ghi sự kiện bằng chính `tx` đang thay đổi dữ liệu, xác định contract payload và cập nhật consumer tương ứng. Chỉ thêm một lệnh publish sau transaction sẽ bỏ mất bảo đảm nguyên tử giữa dữ liệu và bản ghi sự kiện.
