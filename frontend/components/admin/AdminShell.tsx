"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AuthUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
};

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/archive", label: "Archive" },
  { href: "/admin/profile", label: "Profile" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(userRaw) as AuthUser;
      if (parsed.role !== "admin") {
        router.replace("/login");
        return;
      }
      setUser(parsed);
      setReady(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  const title = useMemo(() => {
    const item = navItems.find((n) => pathname?.startsWith(n.href));
    return item?.label ?? "Admin";
  }, [pathname]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white min-h-screen">
          <div className="p-4">
            <div className="text-lg font-semibold">Membership System</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>

          <Separator />

          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "block rounded-md px-3 py-2 text-sm",
                    active ? "bg-zinc-900 text-white" : "hover:bg-zinc-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t text-xs text-muted-foreground">
            Signed in as: <span className="font-medium">{user?.email}</span>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="md:hidden">
                {/* simple mobile fallback */}
                <Button variant="outline" onClick={() => router.push("/admin/profile")}>
                  Menu
                </Button>
              </div>
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">
                {user?.first_name ? `${user.first_name} ${user.last_name ?? ""}` : user?.email}
              </div>
            </div>
          </header>

          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}