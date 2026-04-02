import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const TimeView = () => {
  const [time, setTime] = useState<Date>(() => new Date());

  const timeInterval = 1000; // Update every second

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, timeInterval);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box display={"flex"} alignItems={"flex-end"} gap={2}>
      <Typography variant="boldL" fontWeight={"bold"}>
        {format(time, "dd-MM-yyyy", { locale: vi })}
      </Typography>
      <Typography variant="boldL">
        {format(time, "HH:mm:ss", { locale: vi })}
      </Typography>
    </Box>
  );
};

export default TimeView;
