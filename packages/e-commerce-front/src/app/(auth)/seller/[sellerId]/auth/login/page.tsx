import LoginForm from "@/components/auth/LoginForm/LoginForm";

async function Page({ params }: PageProps<"/seller/[sellerId]/auth/login">) {
  const { sellerId } = await params;

  return (
    <LoginForm
      title={`Đăng nhập người bán ${sellerId ?? ""}`}
      mode="seller"
      sellerId={sellerId}
    />
  );
}

export default Page;
