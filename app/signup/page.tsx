"use client";

import { useState } from "react";
import { signup } from "@/lib/api/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup({ email, password });
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        throw new Error("Login failed after signup");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#E2E8F0]">
      <div className="w-full max-w-md bg-[#1E293B] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#0F172A] border border-[#334155] focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#0F172A] border border-[#334155] focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-[#6366F1] hover:bg-indigo-500 transition">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 p-3 rounded-lg bg-white text-black">
          Continue with Google
        </button>
      </div>
    </div>
  );
}
