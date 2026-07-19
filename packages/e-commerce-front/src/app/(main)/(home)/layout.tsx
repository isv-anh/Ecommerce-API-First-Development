import Newsletter from "@/features/main/home/components/Newsletter/Newsletter";

export default function HomeLayout({
  children,
  category,
  product,
}: {
  children: React.ReactNode;
  category: React.ReactNode;
  product: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {children}
      <div className="w-full flex flex-col gap-12">
        {category}
        {product}
        <Newsletter />
      </div>
    </div>
  );
}
