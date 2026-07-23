import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import OrderGrid from "@/features/admin/order/list/components/OrderGrid/OrderGrid";

const OrderGridPage = () => {
  return (
    <SuspenseWrapper height={350}>
      <OrderGrid />
    </SuspenseWrapper>
  );
};

export default OrderGridPage;
