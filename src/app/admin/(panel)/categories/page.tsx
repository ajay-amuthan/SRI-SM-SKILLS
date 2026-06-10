"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = () =>
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      toast.success("Category created");
      setName("");
      setDescription("");
      fetchCategories();
    } else {
      toast.error("Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    toast.success("Category deleted");
    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={handleCreate} className="bg-white border border-border p-6 mb-6 flex flex-wrap gap-4 items-end">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" size="sm"><Plus className="h-4 w-4" /> Add</Button>
      </form>
      <div className="bg-white border border-border">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center p-4 border-b border-border last:border-0">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-muted">{cat._count.products} products</p>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-muted hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
