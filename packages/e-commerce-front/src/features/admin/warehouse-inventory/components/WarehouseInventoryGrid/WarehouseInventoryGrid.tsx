"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateWarehouseInventoryForm from "@/features/admin/warehouse-inventory/components/CreateWarehouseInventoryForm/CreateWarehouseInventoryForm";
import UpdateWarehouseInventoryForm from "@/features/admin/warehouse-inventory/components/UpdateWarehouseInventoryForm/UpdateWarehouseInventoryForm";
import { warehouseInventorySearchContext } from "@/features/admin/warehouse-inventory/utils";
import { parseSortModel } from "@/utils/parseSortModel";
import {
  useGetProductVariantsSuspense,
  useGetWarehouseInventoriesSuspense,
  useGetWarehousesSuspense,
} from "@e-commerce/api-client/endpoints/product";
import type { WarehouseInventoryResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const defaultPageSize = 20;

type WarehouseInventoryRow = WarehouseInventoryResponse & {
  id: string;
  warehouseName: string;
  productVariantSku: string;
};

const WarehouseInventoryGrid = () => {
  const { params, setParam, setParams } =
    warehouseInventorySearchContext.useSearch();

  const inventoryParams = useMemo(
    () => ({
      warehouseId: params.warehouseId || undefined,
      productVariantId: params.productVariantId || undefined,
    }),
    [params.productVariantId, params.warehouseId],
  );

  const { data, isFetching } =
    useGetWarehouseInventoriesSuspense(inventoryParams);
  const { data: warehousesData } = useGetWarehousesSuspense();
  const { data: productVariantsData } = useGetProductVariantsSuspense();

  const warehouseNameMap = useMemo(
    () =>
      new Map(
        warehousesData.warehouses.map((warehouse) => [
          warehouse.warehouseId,
          warehouse.name,
        ]),
      ),
    [warehousesData.warehouses],
  );

  const productVariantSkuMap = useMemo(
    () =>
      new Map(
        productVariantsData.productVariants.map((variant) => [
          variant.productVariantId,
          variant.sku,
        ]),
      ),
    [productVariantsData.productVariants],
  );

  const columns: GridColDef<WarehouseInventoryRow>[] = [
    { field: "warehouseId", headerName: "ID kho", flex: 1 },
    { field: "productVariantId", headerName: "ID phiên bản", flex: 1 },
    { field: "warehouseName", headerName: "Kho", flex: 1 },
    { field: "productVariantSku", headerName: "SKU", flex: 1 },
    { field: "stock", headerName: "Tồn kho", flex: 1, type: "number" },
  ];

  const enrichedRows = useMemo<WarehouseInventoryRow[]>(() => {
    return data.warehouseInventories.map((inventory) => ({
      id: `${inventory.warehouseId}-${inventory.productVariantId}`,
      warehouseName:
        warehouseNameMap.get(inventory.warehouseId) ?? inventory.warehouseId,
      productVariantSku:
        productVariantSkuMap.get(inventory.productVariantId) ??
        inventory.productVariantId,
      ...inventory,
    }));
  }, [data.warehouseInventories, productVariantSkuMap, warehouseNameMap]);

  const sortedRows = useMemo(() => {
    const sortModel = parseSortModel(params.orderBy);
    const [sort] = sortModel;

    if (!sort?.field || !sort.sort) {
      return enrichedRows;
    }

    return [...enrichedRows].sort((a, b) => {
      const first = a[sort.field as keyof WarehouseInventoryRow];
      const second = b[sort.field as keyof WarehouseInventoryRow];

      if (typeof first === "number" && typeof second === "number") {
        return sort.sort === "asc" ? first - second : second - first;
      }

      const result = String(first ?? "").localeCompare(
        String(second ?? ""),
        "vi",
      );

      return sort.sort === "asc" ? result : -result;
    });
  }, [enrichedRows, params.orderBy]);

  const rows = useMemo(() => {
    const page = params.page || 1;
    const pageSize = params.pageSize || defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return sortedRows.slice(start, end);
  }, [params.page, params.pageSize, sortedRows]);

  const [openCreateInventoryForm, setOpenCreateInventoryForm] = useState(false);
  const [openUpdateInventoryForm, setOpenUpdateInventoryForm] = useState(false);

  const [rowSelection, setRowSelection] =
    useState<WarehouseInventoryResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateInventoryForm(true);
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
            setOpenUpdateInventoryForm(true);
          },
        },
      ];
    }

    return buttons;
  }, [rowSelection]);

  return (
    <Stack
      sx={{
        height: "calc(100vh - 350px)",
        minHeight: 0,
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        page={params.page}
        pageSize={params.pageSize}
        paginationModelChange={(model) =>
          setParams({ page: model.page + 1, pageSize: model.pageSize })
        }
        rowCount={sortedRows.length}
        slotProps={{
          toolbar: {
            leftButtons,
          },
        }}
        loading={isFetching}
        orderBy={params.orderBy}
        orderByChange={(orderBy) => setParam("orderBy", orderBy)}
        onRowClick={(params) => {
          setRowSelection((prev) => {
            const isSelected =
              prev?.warehouseId === params.row.warehouseId &&
              prev?.productVariantId === params.row.productVariantId;

            return isSelected ? undefined : params.row;
          });
        }}
        columnVisibilityModel={{
          warehouseId: false,
          productVariantId: false,
        }}
      />
      <CreateWarehouseInventoryForm
        open={openCreateInventoryForm}
        onClose={() => {
          setOpenCreateInventoryForm(false);
        }}
      />

      {rowSelection && (
        <UpdateWarehouseInventoryForm
          open={openUpdateInventoryForm}
          onClose={() => {
            setOpenUpdateInventoryForm(false);
          }}
          warehouseId={rowSelection.warehouseId}
          productVariantId={rowSelection.productVariantId}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default WarehouseInventoryGrid;
