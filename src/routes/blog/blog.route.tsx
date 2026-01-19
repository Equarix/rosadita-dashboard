import BlogCategoriesPage from "@/pages/blog/categories/BlogCategoriesPage";
import CreateBlogPage from "@/pages/blog/create/CreateBlogPage";
import BlogListPage from "@/pages/blog/list/BlogListPage";
import { Route, Routes } from "react-router";

export default function BlogRoute() {
  return (
    <Routes>
      <Route path="/" element={<BlogListPage />} />
      <Route path="/crear" element={<CreateBlogPage />} />
      <Route path="/categories" element={<BlogCategoriesPage />} />
    </Routes>
  );
}
