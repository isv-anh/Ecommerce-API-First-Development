import Paper from "@mui/material/Paper";
import ActionButton from "../ActionButton/ActionButton";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";

// TODO: Thêm các button khác vào đây
const ActionButtonList = () => {
  return (
    <Paper
      sx={{
        position: "fixed",
        right: 0,
        top: "30%",
        p: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <ActionButton
        icon={RateReviewRoundedIcon}
        onClick={() => {}}
        title="Phản hồi"
        isActive
      />
      <ActionButton
        icon={RateReviewRoundedIcon}
        onClick={() => {}}
        title="Phản hồi"
      />
      <ActionButton
        icon={RateReviewRoundedIcon}
        onClick={() => {}}
        title="Phản hồi"
      />
      <ActionButton
        icon={RateReviewRoundedIcon}
        onClick={() => {}}
        title="Phản hồi"
      />
    </Paper>
  );
};

export default ActionButtonList;
