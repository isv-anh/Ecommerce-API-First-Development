import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";
import type { ReactNode } from "react";
import { AuthBootstrap } from "@/app/AuthBootstrap";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthBootstrap>
      <AdminLayout>{children}</AdminLayout>
    </AuthBootstrap>
  );
};

export default Layout;
