"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiMenu,
  FiUser,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiHome,
  FiBell,
} from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/dashboard" },
    { icon: FiUser, label: "Profile", href: "/dashboard/profile" },
    { icon: FiCalendar, label: "Events", href: "/dashboard/events" },
    { icon: FiSettings, label: "Settings", href: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Overlay (Mobile) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0c0c0c] border-r border-neutral-800 transform transition-transform duration-300 ease-in-out 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                NextGen
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                Student Portal
              </p>
            </motion.div>
          </div>

          {/* Nav */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 
                      ${
                        isActive
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full mt-auto"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 hover:bg-neutral-800 rounded-lg"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              NextGen
            </h1>

            <div className="w-10" />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 pt-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          <div className="flex items-center gap-4">
            <FiBell className="w-5 h-5 text-neutral-400 hover:text-white cursor-pointer" />
            <div className="w-10 h-10 bg-neutral-700 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}