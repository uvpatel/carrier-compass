"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { CreateInterviewModal } from "./CreateInterviewModal";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, isPending } = useSession();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#020408]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 max-sm:px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="Prepwise Logo"
              width={36}
              height={36}
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Prep<span className="text-[#cac5fe]">wise</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#d6e0ff]">
            <Link
              href="/"
              className="hover:text-[#cac5fe] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/#interviews"
              className="hover:text-[#cac5fe] transition-colors"
            >
              My Interviews
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-sm !px-5 !min-h-9 shadow-md hover:shadow-[#cac5fe]/20"
            >
              + Create Interview
            </button>

            {session?.user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-[#cac5fe] text-[#020408] font-bold text-xs flex items-center justify-center">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs text-[#d6e0ff] hidden lg:inline-block font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-[#cac5fe] hover:underline px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <CreateInterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
