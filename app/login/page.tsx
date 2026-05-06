"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#5932ea] text-white text-xl font-bold">
            ⬢
          </div>
          <h1 className="text-2xl font-semibold text-[#202224]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#acacac]">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#202224]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@insurance.com"
              required
              className="w-full rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-4 py-3 text-sm outline-none focus:border-[#5932ea] transition"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#202224]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[#e0e0e0] bg-[#f9fbff] px-4 py-3 text-sm outline-none focus:border-[#5932ea] transition"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#5932ea] py-3 text-sm font-semibold text-white transition hover:bg-[#4a28d1] disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-[#f9fbff] p-4 text-xs text-[#acacac]">
          <p className="font-medium mb-2">Test accounts:</p>
          <p>admin@insurance.com / admin123</p>
          <p>manager@insurance.com / manager123</p>
          <p>viewer@insurance.com / viewer123</p>
        </div>
      </div>
    </div>
  );
}