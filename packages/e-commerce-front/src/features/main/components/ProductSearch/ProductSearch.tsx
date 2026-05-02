import MultiSelect from "@/components/inputs/MultiSelect/MultiSelect";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";

const brands = [
  {
    label: "Apple",
    value: "apple",
  },
  {
    label: "Samsung",
    value: "samsung",
  },
  {
    label: "Xiaomi",
    value: "xiaomi",
  },
  {
    label: "Oppo",
    value: "oppo",
  },
  {
    label: "Vivo",
    value: "vivo",
  },
];

const ProductSearch = () => {
  const { control } = useForm<{ brands: string[] }>({
    defaultValues: {
      brands: [],
    },
  });
  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <MultiSelect
          control={control}
          name="brands"
          options={brands}
          sx={{ width: 300 }}
          limitTags={2}
          aria-label="select-brands"
          label="Thương hiệu"
        />
        {/* {brands.map((brand) => (
          <Chip
            key={brand.name}
            label={brand.name}
            color="primary"
            variant="outlined"
            size="medium"
            sx={{
              cursor: "pointer",
              height: 34,
              width: 100,
              "&:hover": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
              },
              typography: {
                fontSize: 14,
              },
            }}
          />
        ))} */}
      </Stack>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <Chip
          label="Bộ lọc"
          color="primary"
          variant="outlined"
          size="medium"
          sx={{
            cursor: "pointer",
            height: 34,
            width: 100,
            "&:hover": {
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            },
            typography: {
              fontSize: 14,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default ProductSearch;
