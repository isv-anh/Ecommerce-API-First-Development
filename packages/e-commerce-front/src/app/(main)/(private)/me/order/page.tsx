import { UserOrderList } from "@/features/main/order/UserOrderList";

export const metadata = {
  title: "Đơn mua của tôi | E-Commerce",
  description: "Quản lý lịch sử đơn hàng của bạn",
};

export default function UserOrderPage() {
  return <UserOrderList />;
}
