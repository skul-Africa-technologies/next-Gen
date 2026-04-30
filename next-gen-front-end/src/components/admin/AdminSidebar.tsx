"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiCalendar, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Only include Profile if user is logged in
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: FiHome },
    { href: "/admin/students", label: "Students", icon: FiUsers },
    { href: "/admin/events", label: "Events", icon: FiCalendar },
    { href: "/admin/settings", label: "Settings", icon: FiSettings },
    ...(user ? [{ href: "/admin/profile", label: "Profile", icon: FiUser }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col min-h-screen">
      {/* Logo / Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary text-lg">NG</span>
          </div>
          <div>
            <span className="font-bold text-white">NextGen</span>
            <span className="text-xs text-gray-500 block">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    relative group
                    ${active
                      ? "text-white bg-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></span>
                  )}
                  <Icon size={20} className={active ? "text-primary" : "text-gray-500 group-hover:text-white"} />
                  <span className="ml-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <FiUser className="text-primary" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium truncate text-sm">{user.name}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
              <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full mt-1">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
