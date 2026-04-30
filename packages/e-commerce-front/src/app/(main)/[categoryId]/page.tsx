import Category from "@/features/main/category/Category";

const CategoryPage = async ({ params }: PageProps<"/[categoryId]">) => {
  const { categoryId } = await params;
  return <Category />;
};

export default CategoryPage;
