import Wishlist from "@/features/main/wishlist/Wishlist";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";

const WishlistPage = () => {
  return (
    <SuspenseWrapper>
      <Wishlist />
    </SuspenseWrapper>
  );
};

export default WishlistPage;
