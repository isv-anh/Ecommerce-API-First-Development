import TextField from "@/components/inputs/TextField/TextField";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

const Search = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<{ textSearch: string }>({
    defaultValues: {
      textSearch: "",
    },
  });

  const handleSearch = (data: { textSearch: string }) => {
    const query = data.textSearch.trim();
    if (query !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  return (
    <Stack
      component={"form"}
      onSubmit={handleSubmit(handleSearch)}
      height={90}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      spacing={4}
      px={2}
    >
      <Stack width={200}>LOGO</Stack>
      <TextField
        control={control}
        name="textSearch"
        sx={{
          flexGrow: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: (theme) => theme.palette.primary.main,
            },
          },
          "& .MuiInputBase-root": {
            paddingRight: 0,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <Button
                variant="contained"
                sx={{
                  borderRadius: "12px",
                  height: "40px",
                }}
                type="submit"
              >
                <SearchRoundedIcon />
              </Button>
            ),
          },
        }}
      />
      <Stack>
        <Tooltip title="Giỏ hàng">
          <IconButton color="primary">
            <Badge badgeContent={4} color={"error"}>
              <LocalMallIcon
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default Search;
