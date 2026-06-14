export type MenuItem = {
  path: string;
  name: string;
  icon?: string;
  isNavigate?: boolean;
  children?: MenuItem[];
};

export const routes = {
  home: "/",

  admin: {
    dashboard: "/admin",

    category: {
      list: "/admin/category",
    },

    brand: {
      list: "/admin/brand",
    },

    product: {
      list: "/admin/product",

      create: "/admin/product/new",

      detail: (id: string | number) => `/admin/product/${id}`,
    },

    attribute: {
      list: "/admin/attribute",
    },
  },
} as const;

export const adminMenus: MenuItem[] = [
  {
    path: routes.admin.dashboard,
    name: "Dashboard",
    icon: "space_dashboard_rounded",
    isNavigate: true,
  },

  {
    path: routes.admin.category.list,
    name: "Danh mục",
    icon: "category_rounded",
    isNavigate: true,
  },

  {
    path: routes.admin.brand.list,
    name: "Thương hiệu",
    icon: "workspace_premium_rounded",
    isNavigate: true,
  },

  {
    path: routes.admin.attribute.list,
    name: "Thuộc tính",
    icon: "tune_rounded",
    isNavigate: true,
  },

  {
    path: routes.admin.product.list,
    name: "Sản phẩm",
    icon: "inventory_2_rounded",
    isNavigate: true,
  },
];
