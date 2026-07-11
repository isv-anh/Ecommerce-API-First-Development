import Cart from "@/features/main/cart/Cart";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";

const CartPage = () => {
  return (
    <SuspenseWrapper>
      <Cart />
    </SuspenseWrapper>
  );
};

export default CartPage;
