# Nguyên tắc sử dụng Theme — Màu sắc & Kiểu chữ (Colors & Typography)

Tài liệu này định nghĩa các quy tắc và thực tiễn tốt nhất để sử dụng các token màu sắc và kiểu chữ từ cấu hình theme chung của Material UI (MUI). Tuân thủ các quy tắc này giúp giao diện nhất quán, dễ truy cập và dễ bảo trì.

---

## 1. Tóm tắt nhanh (Quy tắc trực tiếp)

- **Luôn sử dụng token từ theme** (`theme.palette`, `theme.typography`). Tuyệt đối không viết cứng mã màu hex, kích thước chữ (font-size) hoặc độ đậm nhạt (font-weight) trong các component.
- **Sử dụng các biến thể kiểu chữ (typography variants) tùy chỉnh** đã được khai báo trong theme: `title`, `subtitle`, `header`, `regularXxs`, `regularXs`, `regularS`, `regularM`, `regularL`, `boldXs`, `boldS`, `boldM`, `boldL`.
- **Sử dụng token màu sắc có tính ngữ nghĩa** (ví dụ: `primary`, `background.default`, `success`, `error`, `text.primary`, `text.secondary`) thay vì các mã màu tùy tiện.
- **Đảm bảo độ tương phản màu sắc**: tối thiểu 4.5:1 đối với văn bản bình thường, và 3:1 đối với văn bản kích thước lớn.
- **Đối với trạng thái hover/active**: sử dụng hàm ghép màu `alpha` từ MUI với giá trị màu của theme (ví dụ: `alpha(theme.palette.primary.main, 0.12)`).

---

## 2. Tại sao phải tuân thủ quy tắc này?

- **Tính nhất quán**: Một nguồn đáng tin cậy duy nhất cho tất cả màu sắc thương hiệu và kiểu chữ.
- **Khả năng tiếp cận (Accessibility)**: Đảm bảo độ tương phản tốt và kiểu hiển thị focus rõ ràng giúp nâng cao tính tương tác.
- **Dễ bảo trì**: Chỉ cần cập nhật token tại một nơi (file định nghĩa theme) để thay đổi giao diện toàn bộ ứng dụng.
- **Đồng bộ thiết kế**: Các token này khớp hoàn toàn với các token thiết kế (Figma Design Tokens) được bàn giao từ đội ngũ thiết kế.

---

## 3. Danh sách Token thực tế của dự án

### 3.1. Bảng màu (Palette) (`theme/palette.ts`)
```typescript
export const palette: ThemeOptions["palette"] = {
  primary: {
    main: "#8225ec",         // Màu tím chủ đạo của thương hiệu
    light: "#9a28f1",
    dark: "#7A3CC8",
    contrastText: "#FFFFFF",
  },
  success: { main: "#22C55E", contrastText: "#FFFFFF" },
  warning: { main: "#F59E0B", contrastText: "#000000" },
  error: { main: "#EF4444", contrastText: "#FFFFFF" },
  info: { main: "#3B82F6", contrastText: "#FFFFFF" },
  text: {
    primary: "#151426",      // Màu chữ tối mặc định
    secondary: "#6B6B78",    // Màu chữ nhạt cho thông tin phụ
    white: "#FFFFFF",
  },
};
```

### 3.2. Kiểu chữ (Typography) (`theme/typography.ts`)
```typescript
export const typography: ThemeOptions["typography"] = {
  title: { fontSize: "24px", fontWeight: 600, lineHeight: 1.25 },
  header: { fontSize: "20px", fontWeight: 500, lineHeight: 1.3 },
  subtitle: { fontSize: "16px", fontWeight: 400, lineHeight: 1.4 },

  regularXxs: { fontSize: "10px", fontWeight: 400 },
  regularXs: { fontSize: "12px", fontWeight: 400 },
  regularS: { fontSize: "14px", fontWeight: 400 },
  regularM: { fontSize: "16px", fontWeight: 400 },
  regularL: { fontSize: "18px", fontWeight: 400 },

  boldXs: { fontSize: "12px", fontWeight: 700 },
  boldS: { fontSize: "14px", fontWeight: 700 },
  boldM: { fontSize: "16px", fontWeight: 700 },
  boldL: { fontSize: "18px", fontWeight: 700 },
};
```

---

## 4. Ví dụ sử dụng trong Code

### Nên làm (Do):
```tsx
import { Typography, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Sử dụng typography variant của theme (Khuyên dùng)
<Typography variant="title">Tiêu đề Trang</Typography>

// Sử dụng palette token thông qua sx hoặc theme callback
<Button 
  sx={{ 
    backgroundColor: (theme) => theme.palette.primary.main, 
    color: (theme) => theme.palette.text.white 
  }}
>
  Hành động chính
</Button>

// Trạng thái hover sử dụng hàm alpha()
<Button
  variant="text"
  sx={{
    "&:hover": (theme) => ({ 
      backgroundColor: alpha(theme.palette.primary.main, 0.12) 
    }),
  }}
>
  Hover vào tôi
</Button>
```

### Không nên làm (Don't):
```tsx
// ❌ Tránh viết cứng màu hoặc kích thước font trong component
<div style={{ color: "#8225ec", fontSize: "24px", fontWeight: 600 }}>Sai nguyên tắc</div>
```

---

## 5. Ánh xạ biến thể (Variant Mapping) và Ngữ nghĩa

- Theme tự động ánh xạ các biến thể tùy chỉnh sang các thẻ HTML ngữ nghĩa tương ứng (ví dụ: `title -> h1`, `subtitle -> h2`, `regularS -> p`).
- Hãy luôn sử dụng thuộc tính `variant` trên component `Typography` của MUI thay vì dùng thẻ HTML thuần (h1, h2) kèm css inline để bảo toàn cấu trúc ngữ nghĩa tốt cho SEO và thiết bị đọc màn hình.

---

## 6. Quy tắc tiếp cận (Accessibility Rules)

- **Độ tương phản**:
  - Đối với chữ thường: Tỷ lệ tương phản tối thiểu giữa chữ và nền phải >= 4.5:1.
  - Đối với chữ lớn (>= 18pt bold hoặc >= 24pt regular): Tỷ lệ tương phản tối thiểu phải >= 3:1.
- **Trạng thái Focus**:
  - Tất cả các phần tử tương tác (nút bấm, liên kết, ô nhập liệu) phải có trạng thái focus hiển thị rõ ràng (khuyến khích sử dụng `:focus-visible`).
- **Không chỉ dùng màu sắc**:
  - Không truyền đạt thông tin chỉ thông qua màu sắc đơn thuần. Luôn đi kèm văn bản giải thích hoặc icon tương ứng.

---

## 7. Quy trình thêm mới hoặc mở rộng Token
1. Chọn tên có tính ngữ nghĩa cao (ví dụ: `surface.card`, tránh đặt tên kiểu `cardGrey1`).
2. Thêm định nghĩa token vào `theme/palette.ts` hoặc `theme/typography.ts`.
3. Tạo hoặc cập nhật câu chuyện Storybook (swatch story) hiển thị token mới.
4. Kiểm tra độ tương phản của màu sắc mới trên các nền khác nhau.
5. Thêm hướng dẫn và ví dụ sử dụng ngắn gọn vào tài liệu này.
