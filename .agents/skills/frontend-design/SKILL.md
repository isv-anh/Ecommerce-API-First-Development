---
name: frontend-design
description: Hướng dẫn thiết kế giao diện Frontend, tạo responsive layouts, quản lý theme, styles và tối ưu hóa UI/UX dựa trên phản hồi của người dùng.
---

## 1. Tổng quan (Overview)

Tài liệu này hướng dẫn các nguyên tắc và quy trình thiết kế giao diện (UI) và trải nghiệm người dùng (UX) cho phía Frontend của dự án `e-commerce-front`. Mục tiêu là xây dựng giao diện chất lượng cao, nhất quán, phản hồi nhanh (responsive) và tuân thủ các chuẩn mực tiếp cận (accessibility).

---

## 2. Cấu trúc thư mục dự án Frontend

```text
packages/e-commerce-front/ (Next.js Frontend App)
├── .storybook/          # Cấu hình Storybook cho UI components
├── public/              # Tài nguyên tĩnh (images, icons, vv.)
├── src/
│   ├── app/             # Định tuyến Next.js App Router
│   ├── components/      # Các UI components tái sử dụng chung
│   ├── features/        # Các components và logic riêng theo từng chức năng (admin, main, vv.)
│   ├── hooks/           # Các React hooks tùy chỉnh
│   ├── theme/           # Cấu hình theme và styling cho Material UI (MUI)
│   └── utils/           # Các hàm tiện ích (utility functions)
```

---

## 3. Các quy tắc thiết kế & phát triển

### 3.1. Sử dụng mui-mcp Server để tra cứu tài liệu MUI
Khi có câu hỏi hoặc cần tìm hiểu về các component của Material UI (MUI):
- Bước 1: Gọi công cụ `useMuiDocs` để tải tài liệu liên quan đến package đang sử dụng.
- Bước 2: Gọi công cụ `fetchDocs` để tải thêm tài liệu nếu cần thông qua các URL trả về từ bước 1.
- Bước 3: Lặp lại bước 1-2 cho đến khi có đầy đủ thông tin để trả lời câu hỏi.

### 3.2. Quản lý Theme và Styling
- **Sử dụng Material UI (MUI)** một cách nhất quán cho toàn bộ ứng dụng.
- Tất cả cấu hình màu sắc, kiểu chữ được tập trung trong thư mục `src/theme/` (thông qua `palette.ts`, `typography.ts`, và `theme.ts`).
- Không viết cứng (hardcode) mã màu hex hoặc kích thước chữ trong component. Luôn tham chiếu qua theme token (ví dụ: `theme.palette.primary.main`).

### 3.3. Thiết kế Component
- Xây dựng các UI component dùng chung trong thư mục `components/` để tăng tính tái sử dụng và tránh trùng lặp mã nguồn.
- Tuân thủ các nguyên tắc thiết kế của Material UI.
- Sử dụng **Storybook** để phát triển và kiểm tra các component một cách độc lập trước khi tích hợp vào dự án.

### 3.4. Responsive Layouts (Bố cục đáp ứng)
- Đảm bảo tất cả giao diện đều hiển thị tốt trên mọi kích thước màn hình bằng cách sử dụng component `Grid` và `Box` của MUI.
- Kiểm tra giao diện trên nhiều thiết bị giả lập để đảm bảo trải nghiệm liền mạch.
- Sử dụng các điểm dừng `theme.breakpoints` để tùy biến bố cục động (dự án định nghĩa các breakpoint: `xs: 600`, `sm: 900`, `md: 1200`, `lg: 1536`, `xl: 1920`).

### 3.5. Quy tắc Import
- Khuyến khích import trực tiếp (path imports) thay vì named imports để tối ưu hóa kích thước bundle khi đóng gói sản phẩm.

```typescript
// ✅ Khuyên dùng
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ❌ Nên tránh
import { Box, Button } from "@mui/material";
```

- Sử dụng thuộc tính `sx` hoặc `styled` components của MUI thay vì CSS inline thông thường để tận dụng hệ thống theme của dự án.

### 3.6. Gọi và xử lý dữ liệu (Data Fetching)
- Sử dụng các hooks (TanStack Query) được sinh tự động trong `@e-commerce/api-client` cho toàn bộ các tác vụ gọi API.
- Không tự viết các hàm gọi API trực tiếp hoặc sử dụng `fetch`/`axios` thủ công trong component.

### 3.7. Biểu mẫu và Xác thực (Form & Validation)
- Sử dụng **React Hook Form** làm thư viện chính để quản lý trạng thái biểu mẫu.
- Sử dụng **Zod** để định nghĩa schema và thực hiện validation để đảm bảo an toàn kiểu dữ liệu.
- Luôn ưu tiên tái sử dụng các types và Zod schemas được xuất bản từ gói chung `@e-commerce/api-client` hoặc `@e-commerce/api-validation` để đồng bộ xác thực giữa Frontend và Backend.

**Ví dụ thực tế:**
```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema xác thực (thông thường được import từ @e-commerce/api-validation)
export const postLoginBody = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

type LoginRequest = z.infer<typeof postLoginBody>;

const { control, handleSubmit, setError } = useForm<LoginRequest>({
  defaultValues: {
    username: "",
    password: "",
  },
  mode: "onSubmit",
  resolver: zodResolver(postLoginBody),
});
```

---

## 4. Danh sách kiểm tra nhanh dành cho nhà phát triển (Checklist)
- [ ] UI Token tồn tại và có tính ngữ nghĩa (semantic).
- [ ] Storybook component đã được thêm hoặc cập nhật.
- [ ] Tỷ lệ tương phản màu sắc được kiểm tra đạt chuẩn tiếp cận (accessibility).
- [ ] Không có mã màu hex hoặc kích thước chữ viết cứng trong file TSX.

---

## 5. Tài liệu liên quan

- Material UI (MUI): [MUI Docs](https://mui.com/material-ui/getting-started/overview/)
- Storybook: [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- TanStack Query: [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- React Hook Form: [React Hook Form Docs](https://react-hook-form.com/get-started)
- Zod: [Zod Docs](https://zod.dev/)
- Next.js (App Router): [Next.js Docs](https://nextjs.org/docs/app)
- Internal Packages:
  - `@e-commerce/api-client`: Các API hooks và schemas sinh tự động.
  - `@e-commerce/api-validation`: Chứa các Zod validation schemas chung.
- Tài liệu bổ sung:
  - [Hướng dẫn sử dụng Theme](./theme/THEME.md): Chi tiết về bảng màu (palette) và kiểu chữ (typography).
