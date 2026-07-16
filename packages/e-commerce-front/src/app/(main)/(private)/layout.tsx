"use client";
import { AuthBootstrap } from "@/app/AuthBootstrap";
import type { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return <AuthBootstrap>{children}</AuthBootstrap>;
};

export default PrivateLayout;
