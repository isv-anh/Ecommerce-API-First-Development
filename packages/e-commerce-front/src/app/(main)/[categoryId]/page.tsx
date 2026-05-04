import Category from "@/features/main/category/Category";

const CategoryPage = async ({ params }: PageProps<"/[categoryId]">) => {
  const { categoryId } = await params;
  console.log("Category ID:", categoryId); // Debug log to check the categoryId value
  return <Category />;
};

export default CategoryPage;
