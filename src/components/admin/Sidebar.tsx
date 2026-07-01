"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Home,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Survey Results", href: "/admin/surveys", icon: ClipboardList },
    { name: "Learning Library", href: "/admin/learning", icon: BookOpen },
    { name: "User Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-6 border-b border-border flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl dark:bg-teal-950 dark:text-teal-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-outfit font-bold text-lg leading-tight text-teal-600 dark:text-teal-400">
              Healthy Life
            </h1>
            <span className="text-xs text-muted-foreground font-medium">Admin Workspace</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const ActiveIcon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/10 dark:bg-teal-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ActiveIcon
                  size={18}
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-white" : "text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold text-foreground transition-all duration-200"
          >
            <Home size={16} />
            <span>Go to Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
