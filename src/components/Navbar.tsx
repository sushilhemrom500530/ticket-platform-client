"use client";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { Button, Dropdown, Avatar, MenuProps, Space } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only rendering auth-dependent UI on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const items: MenuProps['items'] = [
    {
      key: 'profile-info',
      label: (
        <div className="px-4 py-2 border-b border-gray-100 min-w-[200px]">
          <p className="font-bold text-gray-800 m-0">{user?.fullName || "User"}</p>
          <p className="text-xs text-gray-500 m-0">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: (
        <Link href={user?.role === "admin" ? "/dashboard" : "/dashboard/tickets"}>
          View Dashboard
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold tracking-wider hover:text-blue-400 transition-colors">
        TICKET<span className="text-blue-500">PRO</span>
      </Link>
      <div className="flex gap-8 items-center">
        <Link href="/" className="hover:text-blue-400 transition-colors font-medium">Home</Link>
        <Link href="/events" className="hover:text-blue-400 transition-colors font-medium">Events</Link>

        {/* Auth section */}
        {mounted && (
          isAuthenticated ? (
            <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['hover']}>
              <div className="flex items-center gap-3 cursor-pointer group">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  src={user?.profilePhoto}
                  className="border-2 border-blue-500 group-hover:border-blue-400 transition-all"
                />
                <span className="hidden md:inline font-medium group-hover:text-blue-400 transition-colors">
                  {user?.fullName?.split(' ')[0] || "Profile"}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button type="default" className="bg-transparent text-white border-white hover:border-blue-400 hover:text-blue-400 h-10 px-6 rounded-full font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button type="primary" className="bg-blue-600 hover:bg-blue-500 border-none h-10 px-6 rounded-full font-medium">
                  Register
                </Button>
              </Link>
            </div>
          )
        )}

        {/* Placeholder during server-side render / hydration */}
        {!mounted && <div className="w-[120px] h-10" />}
      </div>
    </nav>
  );
}
