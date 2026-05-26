import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
