import Stack from "@mui/material/Stack";
import NavigationMenu from "../../NavigationMenu/NavigationMenu";

const AppNavigationList = () => {
  return (
    <Stack spacing={2}>
      <NavigationMenu />
      <NavigationMenu />
    </Stack>
  );
};

export default AppNavigationList;
