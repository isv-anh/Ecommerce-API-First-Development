import List from "@mui/material/List";

import MenuItem from "@/components/navigation/NavigationMenu/MenuItem/MenuItem";
import { NavigationMenuProps } from "@/components/navigation/NavigationMenu/types";

const NavigationMenu = ({ menuItems }: NavigationMenuProps) => {
  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      {menuItems.map((menuItem) => (
        <MenuItem key={menuItem.path} menuItem={menuItem} />
      ))}
    </List>
  );
};

export default NavigationMenu;
