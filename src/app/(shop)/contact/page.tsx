"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast.success(data.message);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted mb-10">We&apos;d love to hear from you. Reach out anytime!</p>
      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-4 border border-border p-8">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
              className="w-full border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <Button type="submit" loading={loading}>Send Message</Button>
        </form>
        <div className="space-y-8">
          {[
            { icon: MapPin, title: "Address", content: "123 Fashion Street, Hyderabad, Telangana 500001" },
            { icon: Phone, title: "Phone", content: "+91 98765 43210" },
            { icon: Mail, title: "Email", content: "info@srismskills.com" },
            { icon: Clock, title: "Business Hours", content: "Mon - Sat: 10:00 AM - 8:00 PM" },
          ].map(({ icon: Icon, title, content }) => (
            <div key={title} className="flex gap-4">
              <Icon className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted">{content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
