import NavigationMenu from "../../NavigationMenu/NavigationMenu";
import { adminMenus } from "@/utils/pathMap";

const AppNavigationList = () => {
  return <NavigationMenu menuItems={adminMenus} />;
};

export default AppNavigationList;
