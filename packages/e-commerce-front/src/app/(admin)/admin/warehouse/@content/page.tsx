import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import WarehouseGrid from "@/features/admin/warehouse/components/WarehouseGrid/WarehouseGrid";

const WarehouseListContent = () => {
  return (
    <SuspenseWrapper height={350}>
      <WarehouseGrid />
    </SuspenseWrapper>
  );
};

export default WarehouseListContent;
