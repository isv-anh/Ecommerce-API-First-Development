export type FabType = BackFab | ButtonFab;

type CommonFab = {
  label?: string;
};

type BackFab = CommonFab & {
  type: "back";
  href: string;
  onClick?: never;
};

type ButtonFab = CommonFab & {
  type: "button";
  href?: never;
  onClick: () => void;
};

export type FabsContextType = {
  fabs: FabType[];
  setFabs: (fabs: FabType[]) => void;
  clear: () => void;
};
