export type Breadcrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};
