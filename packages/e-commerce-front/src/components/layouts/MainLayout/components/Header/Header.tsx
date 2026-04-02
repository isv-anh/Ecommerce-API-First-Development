import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import Button from "@mui/material/Button";
import NotificationButton from "./components/NotificationButton/NotificationButton";

const Header = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      py={0.5}
      height={35}
    >
      <Stack direction={"row"} spacing={1}>
        <Button
          component={NextLink}
          href={"/me/shop"}
          variant="text"
          size="small"
        >
          Kênh người bán
        </Button>
        <Button
          component={NextLink}
          href={"/auth/seller/signup"}
          variant="text"
          size="small"
        >
          Đăng ký bán hàng
        </Button>
      </Stack>

      <Stack direction={"row"} spacing={1}>
        <NotificationButton />
        <Button
          component={NextLink}
          href={"/me/favorites"}
          variant="text"
          startIcon={<GradeRoundedIcon />}
          size="small"
        >
          Yêu thích
        </Button>
        <Button
          component={NextLink}
          href={"/auth/signin"}
          variant="text"
          size="small"
        >
          Đăng nhập
        </Button>
        <Button
          component={NextLink}
          href={"/auth/signup"}
          variant="text"
          size="small"
        >
          Đăng ký
        </Button>
      </Stack>
    </Stack>
  );
};

export default Header;
