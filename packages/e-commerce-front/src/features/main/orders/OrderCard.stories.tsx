import type { Meta, StoryObj } from "@storybook/react";
import OrderCard from "./OrderCard";
import Button from "@mui/material/Button";

const meta = {
  title: "Main/Orders/OrderCard",
  component: OrderCard,
  parameters: { layout: "padded" },
  args: {
    order: {
      orderId: "123e4567-e89b-12d3-a456-426614174000",
      userId: "123e4567-e89b-12d3-a456-426614174001",
      status: "shipping",
      createdAt: "2026-10-05T08:00:00Z",
      totalAmount: 600000,
      totalDiscount: 50000,
      finalAmount: 550000,
    },
    items: [
      {
        orderItemId: "item-1",
        orderId: "123e4567-e89b-12d3-a456-426614174000",
        productId: "product-1",
        productVariantId: "variant-1",
        productName: "Áo polo cotton",
        variantName: "Xanh navy · Size L",
        thumbnailUrl: "/orders-product-preview.svg",
        price: 300000,
        quantity: 2,
        totalPrice: 600000,
      },
    ],
  },
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Shipping: Story = {};
export const Pending: Story = {
  args: {
    order: { ...meta.args.order, status: "pending" },
    actions: (
      <Button variant="outlined" color="error">
        Hủy đơn hàng
      </Button>
    ),
  },
};
export const MissingImage: Story = {
  args: { items: [{ ...meta.args.items[0], thumbnailUrl: null }] },
};
export const Cancelled: Story = {
  args: { order: { ...meta.args.order, status: "cancelled" } },
};
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 375 }}>
        <Story />
      </div>
    ),
  ],
};
