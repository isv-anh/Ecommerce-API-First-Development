# AI Assistant

## Tool results và state

Các tool chạy qua `create_tool_node`. `ToolMessage.content` chứa dữ liệu gọn gửi
model; `ToolMessage.artifact` lưu kết quả đầy đủ trong checkpoint PostgreSQL.
Chat response và lịch sử đọc artifact để giữ nguyên dữ liệu cho frontend.
Checkpoint cũ không có artifact vẫn được đọc từ content và rút gọn khi gửi model.

Kết quả tìm kiếm gửi model giữ ID, tên, giá, danh mục, thương hiệu và tối đa 240
ký tự mô tả, bỏ ảnh và slug. `description_truncated` báo mô tả đã rút gọn;
Product Agent dùng `get_product_details` lấy mô tả đầy đủ từ kết quả đã lưu khi
cần thông số. Tồn kho giữ nguyên ID biến thể, tên, SKU và số lượng để đặt hàng.
Lỗi tool và kết quả thực thi đơn hàng vẫn được giữ; không gọi thêm model để
tóm tắt tool result.

State nghiệp vụ được cập nhật trực tiếp từ tool arguments/results:

| Trường | Ý nghĩa |
| --- | --- |
| `search_params`, `search_results` | Bộ lọc và kết quả đầy đủ của lần tìm kiếm mới nhất. |
| `inventory_product_id`, `inventory_results` | Sản phẩm vừa kiểm tra và các biến thể/tồn kho trả về. |
| `inspected_product` | Tham chiếu sản phẩm vừa kiểm tra; không đồng nghĩa khách đã chọn mua. |
| `order_draft` | Arguments đề xuất của `place_order_tool`; không phải khách đã xác nhận. |
| `pending_actions` | Tên, arguments và tool call ID của các lệnh nhạy cảm đang chờ. |
| `action_status` | `awaiting_confirmation`, `confirmed`, `rejected` hoặc `executed`. |
| `last_order_result` | Kết quả lần tra cứu/thực thi đơn gần nhất, gồm cả lỗi. |

`order_draft` chỉ được ghi khi agent đề xuất gọi tool đặt hàng; thông tin khách
đang cung cấp từng phần vẫn nằm trong hội thoại. Không có bước gọi model riêng
để trích xuất thông tin. Draft và pending actions được xóa khi từ chối hoặc sau
khi tool thực thi. `executed` biểu thị đã chạy tool, không khẳng định nghiệp vụ
thành công; kiểm tra `last_order_result` để biết kết quả.

Các agent và Supervisor đọc cùng helper context để rút gọn tool messages và
giữ cặp tool call/result khi chọn lịch sử gần đây. Order Agent nhận thêm draft
và trạng thái xác nhận. Graph vẫn dừng trước `sensitive_order_tools`; state không
thay thế xác nhận của khách. Cấu trúc điều phối Supervisor và bước lọc sản phẩm
riêng hiện được giữ nguyên.

## Kiểm tra offline

Chạy từ thư mục gốc repository với môi trường Python đã cài requirements:

```bash
PYTHONPATH=packages/ai-assistant/src packages/ai-assistant/.venv/bin/python -m unittest discover -s packages/ai-assistant/tests -v
```

Tests dùng checkpoint trong RAM và tool giả, không gọi DashScope, gRPC hay
PostgreSQL. Chưa thay thế việc đo token và kiểm tra hội thoại trên môi trường thật.
