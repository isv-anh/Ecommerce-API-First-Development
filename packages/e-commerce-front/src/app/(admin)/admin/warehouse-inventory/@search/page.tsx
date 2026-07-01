import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import WarehouseInventorySearch from "@/features/admin/warehouse-inventory/components/WarehouseInventorySearch/WarehouseInventorySearch";

const WarehouseInventoryListSearch = () => {
  return (
    <SuspenseWrapper height={130}>
      <WarehouseInventorySearch />
    </SuspenseWrapper>
  );
};

export default WarehouseInventoryListSearch;
