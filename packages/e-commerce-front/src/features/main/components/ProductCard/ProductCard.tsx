import Card from "@mui/material/Card";
import { ProductCardProps } from "./types";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import Image from "next/image";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import Link from "@mui/material/Link";

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link component={NextLink} href={product.product_code} underline="none">
      <Card
        sx={{
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.01)",
          },
        }}
      >
        {/* TODO: add default image */}
        <Box sx={{ height: 350, width: "100%", position: "relative" }}>
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.product_name}
              fill
              sizes="300px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
              }}
            >
              <Typography color="text.secondary">No image available</Typography>
            </Box>
          )}
        </Box>

        <Stack>
          <Typography>{product.product_name}</Typography>
        </Stack>

        <CardContent>
          <Stack direction={"row"} spacing={2}>
            <Typography>Total price:</Typography>
            <Typography sx={{ fontSize: "lg", fontWeight: "lg" }}>
              ${product.price}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            aria-label="Explore Bahamas Islands"
            sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
          >
            Explore
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
