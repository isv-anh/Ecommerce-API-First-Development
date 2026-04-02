import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
