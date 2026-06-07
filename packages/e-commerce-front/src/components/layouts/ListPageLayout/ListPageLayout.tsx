import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

export type ListPageLayoutProps = {
  search: ReactNode;
  content: ReactNode;
};

const ListPageLayout = ({ search, content }: ListPageLayoutProps) => {
  return (
    <Paper
      sx={{
        height: "calc(100vh - 145px)",
      }}
    >
      <Stack divider={<Divider />}>
        {search}
        <Stack p={2}>{content}</Stack>
      </Stack>
    </Paper>
  );
};

export default ListPageLayout;
