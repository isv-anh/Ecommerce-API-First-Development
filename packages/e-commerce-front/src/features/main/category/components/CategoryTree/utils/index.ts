import { CategoryResponse } from "@e-commerce/api-client/schemas/product";

type TreeViewItem = {
  id: string;
  label: string;
  children?: TreeViewItem[];
};

/**
 * Transforms a flat list of categories into a hierarchical tree structure based on parent-child relationships.
 *
 * @param categories - A flat list of categories with potential parent-child relationships
 * @returns A hierarchical tree structure of categories suitable for rendering in a tree view component
 */
export const getCategoryTreeData = (
  categories: CategoryResponse[],
): TreeViewItem[] => {
  const categoryMap: Record<string, TreeViewItem> = {};
  const treeData: TreeViewItem[] = [];

  // First pass: Create a map of category ID to TreeViewItem
  categories.forEach((category) => {
    categoryMap[category.categoryId] = {
      id: category.categoryId,
      label: category.categoryName,
    };
  });

  // Second pass: Build the tree structure
  categories.forEach((category) => {
    const treeItem = categoryMap[category.categoryId];
    if (category.parentId) {
      const parentItem = categoryMap[category.parentId];
      if (parentItem) {
        parentItem.children = parentItem.children || [];
        parentItem.children.push(treeItem);
      }
    } else {
      treeData.push(treeItem);
    }
  });

  return treeData;
};
