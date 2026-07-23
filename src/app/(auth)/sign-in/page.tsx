"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Loader2, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to sign in. Please check credentials.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout font-sans">
      <div className="w-full max-w-md p-8 rounded-3xl dark-gradient border border-white/10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image src="/logo.svg" alt="Prepwise" width={40} height={40} />
            <span className="text-2xl font-extrabold text-white">
              Prep<span className="text-[#cac5fe]">wise</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-[#d6e0ff]/70">
            Sign in with Better Auth to access your mock interview sessions.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form space-y-4">
          <div className="space-y-1.5">
            <label className="label text-sm">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="input w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="label text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn pt-3 pb-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              "Sign In with Better Auth"
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#d6e0ff] border border-white/10 transition-colors"
          >
            Continue as Guest / Demo User
          </button>

          <p className="text-xs text-[#d6e0ff]/70">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-[#cac5fe] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
