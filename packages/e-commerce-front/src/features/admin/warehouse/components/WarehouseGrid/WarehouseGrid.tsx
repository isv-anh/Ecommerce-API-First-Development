"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateWarehouseForm from "@/features/admin/warehouse/components/CreateWarehouseForm/CreateWarehouseForm";
import UpdateWarehouseForm from "@/features/admin/warehouse/components/UpdateWarehouseForm/UpdateWarehouseForm";
import { warehouseSearchContext } from "@/features/admin/warehouse/utils";
import { parseSortModel } from "@/utils/parseSortModel";
import { useGetWarehousesSuspense } from "@e-commerce/api-client/endpoints/product";
import type { Warehouse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { format } from "date-fns";
import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const defaultPageSize = 20;

const formatDateTime = (value: string) => {
  if (!value) return "";

  return format(new Date(value), "yyyy-MM-dd HH:mm");
};

const WarehouseGrid = () => {
  const { params, setParam, setParams } = warehouseSearchContext.useSearch();
  const { data, isFetching } = useGetWarehousesSuspense();

  const columns: GridColDef[] = [
    { field: "warehouseId", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Tên kho", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 2 },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
      valueFormatter: (value: string) => formatDateTime(value),
    },
  ];

  const filteredWarehouses = useMemo(() => {
    const name = params.name?.trim().toLowerCase();
    const address = params.address?.trim().toLowerCase();

    return data.warehouses.filter((warehouse) => {
      const matchesName =
        !name || warehouse.name.toLowerCase().includes(name);
      const matchesAddress =
        !address || warehouse.address.toLowerCase().includes(address);

      return matchesName && matchesAddress;
    });
  }, [data.warehouses, params.address, params.name]);

  const sortedWarehouses = useMemo(() => {
    const sortModel = parseSortModel(params.orderBy);
    const [sort] = sortModel;

    if (!sort?.field || !sort.sort) {
      return filteredWarehouses;
    }

    return [...filteredWarehouses].sort((a, b) => {
      const first = String(a[sort.field as keyof Warehouse] ?? "");
      const second = String(b[sort.field as keyof Warehouse] ?? "");
      const result = first.localeCompare(second, "vi");

      return sort.sort === "asc" ? result : -result;
    });
  }, [filteredWarehouses, params.orderBy]);

  const rows = useMemo(() => {
    const page = params.page || 1;
    const pageSize = params.pageSize || defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return sortedWarehouses.slice(start, end).map((warehouse) => {
      return {
        id: warehouse.warehouseId,
        ...warehouse,
      };
    });
  }, [params.page, params.pageSize, sortedWarehouses]);

  const [openCreateWarehouseForm, setOpenCreateWarehouseForm] = useState(false);
  const [openUpdateWarehouseForm, setOpenUpdateWarehouseForm] = useState(false);

  const [rowSelection, setRowSelection] = useState<Warehouse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateWarehouseForm(true);
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
            setOpenUpdateWarehouseForm(true);
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
        rowCount={sortedWarehouses.length}
        slotProps={{
          toolbar: {
            leftButtons,
          },
        }}
        loading={isFetching}
        orderBy={params.orderBy}
        orderByChange={(orderBy) => setParam("orderBy", orderBy)}
        onRowClick={(params) => {
          setRowSelection((prev) =>
            prev?.warehouseId === params.row.warehouseId
              ? undefined
              : params.row,
          );
        }}
        columnVisibilityModel={{
          warehouseId: false,
        }}
      />
      <CreateWarehouseForm
        open={openCreateWarehouseForm}
        onClose={() => {
          setOpenCreateWarehouseForm(false);
        }}
      />

      {rowSelection && (
        <UpdateWarehouseForm
          open={openUpdateWarehouseForm}
          onClose={() => {
            setOpenUpdateWarehouseForm(false);
          }}
          id={rowSelection.warehouseId}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default WarehouseGrid;
