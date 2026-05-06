import List from "@mui/material/List";

import MenuItem from "@/components/navigation/NavigationMenu/MenuItem/MenuItem";
import { NavigationMenuProps } from "@/components/navigation/NavigationMenu/types";

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
