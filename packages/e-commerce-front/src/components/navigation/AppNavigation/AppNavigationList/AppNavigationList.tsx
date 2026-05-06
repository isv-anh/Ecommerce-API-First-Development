import Stack from "@mui/material/Stack";
import NavigationMenu from "../../NavigationMenu/NavigationMenu";



const AppNavigationList = () => {

  return (
    <Stack spacing={2}>
      <NavigationMenu appItems={[]} />
    </Stack>
  );
};

export default AppNavigationList;
