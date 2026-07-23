import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import OrderDetail from "@/features/admin/order/detail/OrderDetail";

const OrderDetailPage = async ({
  params,
}: PageProps<"/admin/order/[orderId]">) => {
  const { orderId } = await params;
  return (
    <SuspenseWrapper>
      <OrderDetail orderId={orderId} />
    </SuspenseWrapper>
  );
};

export default OrderDetailPage;
