"use client";
import TimeView from "@/features/main/portal/components/TimeView/TimeView";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Portal = () => {
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={2}
    >
      <TimeView />
      <Stack direction={"row"} spacing={2}>
        <Button size="large">Checkin</Button>
        <Button size="large">Checkout</Button>
      </Stack>
    </Stack>
  );
};

export default Portal;
