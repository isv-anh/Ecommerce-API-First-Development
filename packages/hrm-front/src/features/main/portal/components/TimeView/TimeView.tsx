import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const TimeView = () => {
  const [time, setTime] = useState<Date | null>(null);

  const timeInterval = 1000; // Update every second

  useEffect(() => {
    setTime(new Date()); // Set initial time on client
    const timer = setInterval(() => {
      setTime(new Date());
    }, timeInterval);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return null; // Or a skeleton/placeholder
  }

  return (
    <Box display={"flex"} alignItems={"flex-end"} gap={2}>
      <Typography variant="h4" fontWeight={"bold"}>
        {format(time, "dd-MM-yyyy", { locale: vi })}
      </Typography>
      <Typography variant="h6">
        {format(time, "HH:mm:ss", { locale: vi })}
      </Typography>
    </Box>
  );
};

export default TimeView;
