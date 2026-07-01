export type LoginFormProps = LoginWithUser | LoginWithAdmin;

type BaseProps = {
  title?: string;
};

type LoginWithUser = BaseProps & {
  mode: "user";
};

type LoginWithAdmin = BaseProps & {
  mode: "admin";
};
