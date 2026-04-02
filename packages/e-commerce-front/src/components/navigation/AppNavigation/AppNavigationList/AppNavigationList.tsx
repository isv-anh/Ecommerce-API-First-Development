import Stack from "@mui/material/Stack";
import NavigationMenu from "../../NavigationMenu/NavigationMenu";

import { useMemo } from "react";
import { mapToAppItem } from "../../NavigationMenu/utils";
import { useListAppsSuspense } from "@e-commerce/api-client/endpoints/system/system";

const AppNavigationList = () => {
  const queryApps = useListAppsSuspense();

  const appItems = useMemo(() => {
    return mapToAppItem(queryApps.data.data.apps);
  }, [queryApps.data.data.apps]);
  return (
    <Stack spacing={2}>
      <NavigationMenu appItems={appItems} />
    </Stack>
  );
};

export default AppNavigationList;
