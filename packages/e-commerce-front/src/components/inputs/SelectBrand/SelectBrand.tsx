import type { SelectBrandsProps } from "@/components/inputs/SelectBrand/types";
import ServerSingleSelect from "@/components/inputs/ServerSingleSelect/ServerSingleSelect";
import {
  getBrands,
  getGetBrandsQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import type { FieldValues } from "react-hook-form";

const SelectBrand = <TField extends FieldValues>({
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
      queryKey={getGetBrandsQueryKey()}
      queryFn={({ pageParam, search }) =>
        getBrands({
          brandName: search || undefined,
          page: pageParam,
        })
      }
      getNextPageParam={(lastPage, allPages) =>
        allPages.length < lastPage.totalPages ? allPages.length + 1 : undefined
      }
      select={(page) => ({
        data: page.brands.map((brand) => ({
          label: brand.brandName,
          value: brand.brandId,
        })),
      })}
    />
  );
};

export default SelectBrand;
