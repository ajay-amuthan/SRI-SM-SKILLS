"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { ProductWithCategory } from "@/types";

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "", categoryId: "",
    images: "", sizes: "", colors: "", stock: "", isFeatured: false, isNewArrival: false, isBestSeller: false,
  });

  const fetchData = () => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", comparePrice: "", categoryId: "", images: "", sizes: "", colors: "", stock: "", isFeatured: false, isNewArrival: false, isBestSeller: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(editing && { id: editing }),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      categoryId: form.categoryId,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
    };

    const res = await fetch("/api/admin/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editing ? "Product updated" : "Product created");
      resetForm();
      fetchData();
    } else {
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: ProductWithCategory) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      categoryId: product.categoryId,
      images: product.images.join(", "),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      stock: product.stock.toString(),
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-border p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Product" : "New Product"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className="w-full border border-border px-4 py-2.5 text-sm">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Compare Price" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <Input label="Images (comma-separated URLs)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} required />
            <Input label="Sizes (comma-separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} required />
            <Input label="Colors (comma-separated)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required rows={3} className="w-full border border-border px-4 py-2.5 text-sm" />
          <div className="flex gap-4 text-sm">
            {(["isFeatured", "isNewArrival", "isBestSeller"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                {key.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Flags</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-muted">{p.category.name}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-xs">
                  {p.isFeatured && <span className="bg-gold/20 text-gold px-1 mr-1">Featured</span>}
                  {p.isNewArrival && <span className="bg-blue-100 text-blue-700 px-1 mr-1">New</span>}
                  {p.isBestSeller && <span className="bg-green-100 text-green-700 px-1">Best</span>}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(p)} className="p-1 hover:text-gold"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
