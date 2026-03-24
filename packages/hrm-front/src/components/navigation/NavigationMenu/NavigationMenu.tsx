import List from "@mui/material/List";
import { NavigationMenuProps } from "./types";
import MenuItem from "./MenuItem/MenuItem";

const NavigationMenu = ({ appItems }: NavigationMenuProps) => {
  return (
    <List
      sx={{ width: "100%", color: (theme) => theme.palette.common.white }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {appItems.map((appItem) => (
        <MenuItem key={appItem.appId} appItem={appItem} />
      ))}
    </List>
  );
};

export default NavigationMenu;
