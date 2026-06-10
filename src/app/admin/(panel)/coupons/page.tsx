"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({
    code: "", discountType: "PERCENTAGE", discountValue: "", minOrder: "0", maxUses: "",
  });

  const fetchCoupons = () =>
    fetch("/api/admin/coupons").then((r) => r.json()).then(setCoupons);

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrder: Number(form.minOrder),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
      }),
    });
    if (res.ok) {
      toast.success("Coupon created");
      setForm({ code: "", discountType: "PERCENTAGE", discountValue: "", minOrder: "0", maxUses: "" });
      fetchCoupons();
    } else {
      toast.error("Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    toast.success("Coupon deleted");
    fetchCoupons();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>
      <form onSubmit={handleCreate} className="bg-white border border-border p-6 mb-6 flex flex-wrap gap-4 items-end">
        <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <div>
          <label className="block text-sm font-medium mb-1.5">Type</label>
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="border border-border px-4 py-2.5 text-sm">
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>
        <Input label="Value" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
        <Input label="Min Order" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
        <Input label="Max Uses" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
        <Button type="submit" size="sm"><Plus className="h-4 w-4" /> Add</Button>
      </form>
      <div className="bg-white border border-border">
        {coupons.map((c) => (
          <div key={c.id} className="flex justify-between items-center p-4 border-b last:border-0">
            <div>
              <p className="font-medium">{c.code}</p>
              <p className="text-xs text-muted">
                {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₹${c.discountValue}`} off
                | Min: ₹{c.minOrder} | Used: {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
                | {c.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-muted hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
