import { useBreadcrumbs } from "@/components/navigation/Breadcrumbs/components/BreadcrumbsProvider/hooks";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>{breadcrumb.label}</span>
      ))}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
