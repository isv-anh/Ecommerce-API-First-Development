import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import WarehouseInventoryGrid from "@/features/admin/warehouse-inventory/components/WarehouseInventoryGrid/WarehouseInventoryGrid";

const WarehouseInventoryListContent = () => {
  return (
    <SuspenseWrapper height={350}>
      <WarehouseInventoryGrid />
    </SuspenseWrapper>
  );
};

export default WarehouseInventoryListContent;
