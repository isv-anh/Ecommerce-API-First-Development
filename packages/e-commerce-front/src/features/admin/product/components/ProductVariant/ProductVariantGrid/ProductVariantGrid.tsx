import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import AddIcon from "@mui/icons-material/Add";
import { useGetProductVariantsSuspense } from "@e-commerce/api-client/endpoints/product";
import type { ProductVariantResponse } from "@e-commerce/api-client/schemas/product";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import CreateVariant from "@/features/admin/product/components/ProductVariant/CreateVariant/CreateVariant";
import UpdateVariant from "@/features/admin/product/components/ProductVariant/UpdateVariant/UpdateVariant";
import Image from "next/image";

const ProductVariantGrid = ({ productId }: { productId: string }) => {
  const queryProductVariant = useGetProductVariantsSuspense({
    productId: productId,
  });

  const variantAttributes =
    queryProductVariant.data.productVariants?.[0]?.variantAttributes ?? [];

  const columns: GridColDef<ProductVariantResponse>[] = [
    {
      field: "sku",
      headerName: "SKU",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Giá bán",
      flex: 1,
    },
    {
      field: "comparePrice",
      headerName: "Giá so sánh",
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Số lượng",
      flex: 1,
    },
    {
      field: "thumbnailUrl",
      headerName: "Hình ảnh",
      renderCell: (params) => {
        return params.row.thumbnailUrl ? (
          <Image
            alt={params.row.thumbnailUrl}
            src={params.row.thumbnailUrl}
            width={50}
            height={50}
          />
        ) : (
          ""
        );
      },
      flex: 1,
    },

    ...variantAttributes.map((value) => ({
      field: `attribute-${value.attributeId}`,
      headerName: value.attributeName,

      renderCell: (params: GridRenderCellParams<ProductVariantResponse>) => {
        return (
          params.row.variantAttributes.find(
            (item) => item.attributeId === value.attributeId,
          )?.attributeValue || ""
        );
      },
    })),
  ];

  const [openCreateProductVariantForm, setOpenCreateProductVariantForm] =
    useState(false);
  const [openUpdateProductVariantForm, setOpenUpdateProductVariantForm] =
    useState(false);

  const [rowSelection, setRowSelection] = useState<ProductVariantResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateProductVariantForm(true);
        },
        startIcon: <AddIcon />,
      },
    ];
    if (rowSelection) {
      return [
        ...buttons,
        {
          label: "Chỉnh sửa",
          action: () => {
            setOpenUpdateProductVariantForm(true);
          },
        },
      ];
    }

    return buttons;
  }, [rowSelection]);

  return (
    <>
      <DataGrid
        columns={columns}
        rows={queryProductVariant.data.productVariants.map((data) => {
          return {
            id: data.productVariantId,
            ...data,
          };
        })}
        onRowClick={(params) => {
          setRowSelection((prev) =>
            prev?.productVariantId === params.row.productVariantId &&
            prev?.productId === params.row.productId
              ? undefined
              : params.row,
          );
        }}
        paginationMode="client"
        sortingMode="client"
        paginationModel={{
          page: 0,
          pageSize: 100,
        }}
        slotProps={{
          toolbar: {
            leftButtons,
          },
        }}
      />
      <CreateVariant
        productId={productId}
        open={openCreateProductVariantForm}
        onClose={() => {
          setOpenCreateProductVariantForm(false);
        }}
      />

      {rowSelection && (
        <UpdateVariant
          open={openUpdateProductVariantForm}
          onClose={() => {
            setOpenUpdateProductVariantForm(false);
          }}
          productVariantId={rowSelection.productVariantId}
          setRowSelection={setRowSelection}
        />
      )}
    </>
  );
};

export default ProductVariantGrid;
