"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      const session = await getSession();
      toast.success("Welcome back!");
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm text-muted mt-2">Sign in to your Sri SM Skills account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 border border-border p-8">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-gold hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
