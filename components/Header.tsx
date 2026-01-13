"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";

type UserProp = { name?: string | null; email?: string | null } | undefined;

export default function Header({ user }: { user?: UserProp }) {
  const { user: clientUser } = useUser();
  const currentUser = user ?? clientUser ?? null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={currentUser ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
          Applyr
        </Link>

        <div className="flex gap-4 items-center">
          {currentUser ? (
            <>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-indigo-200 text-white rounded-lg hover:bg-indigo-300 transition-colors text-lg font-semibold"
            >
              <span className="text-gray-700">{currentUser.name || currentUser.email}</span>
            </Link>
              <Link href="/api/auth/logout" className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/api/auth/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
                Log in
              </Link>
              <Link
                href="/api/auth/login"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
