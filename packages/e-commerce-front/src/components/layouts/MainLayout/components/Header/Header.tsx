"use client";

import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import Button from "@mui/material/Button";
import NotificationButton from "./components/NotificationButton/NotificationButton";
import { useUser } from "@/providers/UserProvider/UserProvider";
import UserMenu from "./components/UserMenu/UserMenu";

const Header = () => {
  const { user, isInitialized } = useUser();

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      py={0.5}
      height={35}
    >
      <Stack direction={"row"} spacing={1} />

      <Stack direction={"row"} spacing={1}>
        <NotificationButton />
        <Button
          component={NextLink}
          href={"/wishlist"}
          variant="text"
          startIcon={<GradeRoundedIcon />}
          size="small"
        >
          Yêu thích
        </Button>
        {isInitialized && (
          user ? (
            <UserMenu user={user} />
          ) : (
            <>
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
            </>
          )
        )}
      </Stack>
    </Stack>
  );
};

export default Header;
