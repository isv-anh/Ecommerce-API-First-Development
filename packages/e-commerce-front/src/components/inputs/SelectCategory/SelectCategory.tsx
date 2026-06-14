import type { SelectCategoryProps } from "@/components/inputs/SelectCategory/types";
import ServerSingleSelect from "@/components/inputs/ServerSingleSelect/ServerSingleSelect";
import {
  getCategories,
  getGetCategoriesQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import type { FieldValues } from "react-hook-form";

const SelectCategory = <TField extends FieldValues>({
  control,
  name,
  label,
}: SelectCategoryProps<TField>) => {
  return (
    <ServerSingleSelect
      control={control}
      name={name}
      label={label}
      fullWidth
      queryKey={getGetCategoriesQueryKey()}
      queryFn={({ pageParam, search }) =>
        getCategories({
          categoryName: search || undefined,
          page: pageParam,
        })
      }
      getNextPageParam={(lastPage, allPages) =>
        allPages.length < lastPage.totalPages ? allPages.length + 1 : undefined
      }
      select={(page) => ({
        data: page.categories.map((category) => ({
          label: category.categoryName,
          value: category.categoryId,
        })),
      })}
    />
  );
};

export default SelectCategory;
