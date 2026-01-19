import BlogCategoriesPage from "@/pages/blog/categories/BlogCategoriesPage";
import { Route, Routes } from "react-router";

export default function BlogRoute() {
  return (
    <Routes>
      <Route path="/" element={<div>Blog Home</div>} />
      <Route path="/categories" element={<BlogCategoriesPage />} />
    </Routes>
  );
}
