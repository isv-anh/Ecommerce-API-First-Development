export type LoginFormProps = LoginWithUser | LoginWithSeller | LoginWithAdmin;

type BaseProps = {
  title?: string;
};

type LoginWithUser = BaseProps & {
  mode: "user";
  sellerId?: never;
};

type LoginWithSeller = BaseProps & {
  mode: "seller";
  sellerId: string;
};

type LoginWithAdmin = BaseProps & {
  mode: "admin";
  sellerId?: never;
};
