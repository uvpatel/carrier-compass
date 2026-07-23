"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Loader2, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to create account.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "github" | "google") => {
    setSocialLoading(provider);
    setErrorMessage("");
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to sign up with ${provider}.`);
      setSocialLoading(null);
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
          <h2 className="text-2xl font-bold text-white pt-2">Create an Account</h2>
          <p className="text-xs text-[#d6e0ff]/70">
            Sign up to start preparing for your tech interviews.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Social Sign Up Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-[#27282f] text-white hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all"
          >
            {socialLoading === "github" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>Sign Up with GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-[#27282f] text-white hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all"
          >
            {socialLoading === "google" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.7-.6-1.5-.6-2.3z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
            )}
            <span>Sign Up with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#17181c] px-3 text-xs text-[#d6e0ff]/50 absolute uppercase font-semibold">
            Or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="form space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="label text-sm">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="input w-full"
            />
          </div>

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
                Creating Account...
              </>
            ) : (
              "Sign Up with Email"
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-[#d6e0ff]/70">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#cac5fe] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
