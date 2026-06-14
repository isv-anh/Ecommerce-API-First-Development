import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import AttributeGrid from "@/features/admin/attribute/components/AttributeGrid/AttributeGrid";

const AttributeListContent = () => {
  return (
    <SuspenseWrapper height={350}>
      <AttributeGrid />
    </SuspenseWrapper>
  );
};

export default AttributeListContent;
