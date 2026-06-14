import { FabsContext } from "@/components/inputs/Fabs/provider/FabsProvider";
import { useContext } from "react";

const useFabs = () => {
  const context = useContext(FabsContext);
  if (!context) {
    throw new Error("useFabs must be used within a FabsProvider");
  }
  return context;
};

export default useFabs;
