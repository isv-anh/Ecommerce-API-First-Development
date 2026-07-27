import { UserOrderDetail } from "@/features/main/order/UserOrderDetail";

interface UserOrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata = {
  title: "Chi tiết đơn hàng | E-Commerce",
  description: "Chi tiết đơn hàng của người dùng",
};

export default async function UserOrderDetailPage({ params }: UserOrderDetailPageProps) {
  const { orderId } = await params;
  return <UserOrderDetail orderId={orderId} />;
}
