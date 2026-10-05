import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import type { OrderResponse } from "@e-commerce/api-client/schemas/order";
import CancelOrderButton from "./CancelOrderButton";

const mocks = vi.hoisted(() => ({ cancel: vi.fn(), notify: vi.fn() }));
vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: mocks.notify }),
}));
vi.mock("@e-commerce/api-client/endpoints/order", () => ({
  getGetOrdersQueryKey: () => ["orders"],
  getGetOrderByIdQueryKey: (id: string) => ["order", id],
  useCancelOrder: () => useMutation({ mutationFn: mocks.cancel }),
}));

const order: OrderResponse = {
  orderId: "123e4567-e89b-12d3-a456-426614174000",
  userId: "123e4567-e89b-12d3-a456-426614174001",
  status: "PENDING",
  createdAt: "2026-10-05T08:00:00Z",
  totalAmount: 100,
  totalDiscount: 0,
  finalAmount: 100,
};

function setup(status = "PENDING") {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  client.setQueryData(["orders", { page: 1 }], {
    orders: [order],
    totalCount: 1,
    totalPages: 1,
  });
  render(
    <QueryClientProvider client={client}>
      <CancelOrderButton order={{ ...order, status }} />
    </QueryClientProvider>,
  );
  return client;
}

afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks();
  mocks.cancel.mockResolvedValue(undefined);
});

describe("CancelOrderButton", () => {
  it.each(["PENDING", "confirmed"])("offers cancellation for %s", (status) => {
    setup(status);
    expect(screen.getByRole("button", { name: "Hủy đơn hàng" })).toBeDefined();
  });

  it.each(["SHIPPING", "COMPLETED", "CANCELLED"])(
    "hides cancellation for %s",
    (status) => {
      setup(status);
      expect(screen.queryByRole("button", { name: "Hủy đơn hàng" })).toBeNull();
    },
  );

  it("only calls the API after confirmation and updates the cached status", async () => {
    const client = setup();
    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn hàng" }));
    expect(mocks.cancel).not.toHaveBeenCalled();
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Hủy đơn hàng",
      }),
    );
    await waitFor(() => expect(mocks.cancel).toHaveBeenCalled());
    expect(mocks.cancel.mock.calls[0][0]).toEqual({ orderId: order.orderId });
    await waitFor(() =>
      expect(client.getQueryData(["orders", { page: 1 }])).toMatchObject({
        orders: [{ status: "CANCELLED" }],
      }),
    );
    expect(mocks.notify).toHaveBeenCalledWith("Đã hủy đơn hàng thành công.", {
      variant: "success",
    });
  });

  it("leaves the order unchanged when dismissing confirmation", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn hàng" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Hủy",
      }),
    );
    expect(mocks.cancel).not.toHaveBeenCalled();
  });

  it("reports failures and allows retrying without changing the order", async () => {
    mocks.cancel.mockRejectedValue(new Error("Unavailable"));
    const client = setup();
    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn hàng" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Hủy đơn hàng",
      }),
    );
    await waitFor(() =>
      expect(mocks.notify).toHaveBeenCalledWith(expect.any(String), {
        variant: "error",
      }),
    );
    expect(client.getQueryData(["orders", { page: 1 }])).toMatchObject({
      orders: [{ status: "PENDING" }],
    });
    expect(
      (
        screen.getByRole("button", {
          name: "Hủy đơn hàng",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
  });

  it("disables cancellation while the request is pending", async () => {
    mocks.cancel.mockReturnValue(new Promise(() => {}));
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn hàng" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Hủy đơn hàng",
      }),
    );
    await waitFor(() =>
      expect(
        (
          screen.getByRole("button", {
            name: "Đang hủy...",
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(true),
    );
    expect(mocks.cancel).toHaveBeenCalledTimes(1);
  });
});
