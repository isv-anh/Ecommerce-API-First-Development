import type { SelectBrandsProps } from "@/components/inputs/SelectBrand/types";
import ServerSingleSelect from "@/components/inputs/ServerSingleSelect/ServerSingleSelect";
import {
  getAttributes,
  getGetAttributesQueryKey,
} from "@e-commerce/api-client/endpoints/product";

import type { FieldValues } from "react-hook-form";

const SelectAttribute = <TField extends FieldValues>({
  control,
  name,
  label,
}: SelectBrandsProps<TField>) => {
  return (
    <ServerSingleSelect
      control={control}
      name={name}
      label={label}
      fullWidth
      queryKey={getGetAttributesQueryKey()}
      queryFn={({ pageParam, search }) =>
        getAttributes({
          attributeName: search || undefined,
          page: pageParam,
        })
      }
      getNextPageParam={(lastPage, allPages) =>
        allPages.length < lastPage.totalPages ? allPages.length + 1 : undefined
      }
      select={(page) => ({
        data: page.attributes.map((attr) => ({
          label: attr.attributeName,
          value: attr.attributeId,
        })),
      })}
    />
  );
};

export default SelectAttribute;
