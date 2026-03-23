import { TabsProps } from "./types";
import MuiTabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Tabs = ({ items, ...props }: TabsProps) => {
  return (
    <MuiTabs {...props}>
      {items.map((item) => (
        <Tab
          key={item.value}
          label={
            <Badge badgeContent={item.badgeCount} color="error">
              <Box pr={0.5}>
                <Typography variant="regularS">{item.label}</Typography>
              </Box>
            </Badge>
          }
          value={item.value}
        />
      ))}
    </MuiTabs>
  );
};

export default Tabs;
