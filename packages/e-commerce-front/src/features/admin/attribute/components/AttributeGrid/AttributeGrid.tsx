"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateAttributeForm from "@/features/admin/attribute/components/CreateAttributeForm/CreateAttributeForm";
import UpdateAttributeForm from "@/features/admin/attribute/components/UpdateAttributeForm/UpdateAttributeForm";
import { attributeSearchContext } from "@/features/admin/attribute/utils";

import { useGetAttributesSuspense } from "@e-commerce/api-client/endpoints/product";
import type { AttributeResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const AttributeGrid = () => {
  const { params, setParam, setParams } = attributeSearchContext.useSearch();
  const { data, isFetching } = useGetAttributesSuspense(params);

  const columns: GridColDef[] = [
    { field: "attributeId", headerName: "ID", flex: 1 },
    { field: "attributeName", headerName: "Tên thuộc tính", flex: 1 },
  ];

  const rows = useMemo(() => {
    return data.attributes.map((attr) => {
      return {
        id: attr.attributeId,
        ...attr,
      };
    });
  }, [data.attributes]);

  const [openCreateAttributeForm, setOpenCreateAttributeForm] = useState(false);
  const [openUpdateAttributeForm, setOpenUpdateAttributeForm] = useState(false);

  const [rowSelection, setRowSelection] = useState<AttributeResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateAttributeForm(true);
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
            setOpenUpdateAttributeForm(true);
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
        rowCount={data.totalCount}
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
            prev?.attributeId === params.row.attributeId
              ? undefined
              : params.row,
          );
        }}
        columnVisibilityModel={{
          AttributeId: false,
        }}
      />
      <CreateAttributeForm
        open={openCreateAttributeForm}
        onClose={() => {
          setOpenCreateAttributeForm(false);
        }}
      />

      {rowSelection && (
        <UpdateAttributeForm
          open={openUpdateAttributeForm}
          onClose={() => {
            setOpenUpdateAttributeForm(false);
          }}
          id={rowSelection.attributeId}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default AttributeGrid;
