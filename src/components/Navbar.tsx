"use client";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { Button } from "antd";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold tracking-wider hover:text-blue-400 transition-colors">
        TICKET<span className="text-blue-500">PRO</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link href="/events" className="hover:text-blue-400 transition-colors">Events</Link>
        
        {isAuthenticated ? (
          <>
            <Link href={user?.role === "admin" ? "/dashboard/overview" : "/dashboard/tickets"} className="hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
            <Button danger type="primary" onClick={logout}>Logout</Button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button type="default" className="bg-transparent text-white border-white hover:border-blue-400 hover:text-blue-400">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button type="primary" className="bg-blue-600 hover:bg-blue-500 border-none">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
