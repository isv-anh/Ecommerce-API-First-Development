import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";

const DetailPageLayout = () => {
  return (
    <Paper
      sx={{
        height: "calc(100vh - 145px)",
      }}
    >
      <Fab variant="extended" size="medium" color="default">
        Quay lại
      </Fab>
      <Fab variant="extended" size="medium" color="default">
        Lưu
      </Fab>
    </Paper>
  );
};

export default DetailPageLayout;
