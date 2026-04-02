import KeyboardTabRoundedIcon from "@mui/icons-material/KeyboardTabRounded";
import Paper from "@mui/material/Paper";
import ActionButton from "../ActionButton/ActionButton";

const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Paper
      sx={{
        position: "fixed",
        right: 0,
        top: "70%",
        p: 0.5,
      }}
    >
      <ActionButton
        onClick={handleScrollToTop}
        title="Lên đầu trang"
        icon={KeyboardTabRoundedIcon}
        iconProps={{
          sx: {
            transform: "rotate(-90deg)",
          },
        }}
      />
    </Paper>
  );
};

export default ScrollToTopButton;
