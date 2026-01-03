"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Account info & logout.</p>
      </div>

      <div className="rounded-lg border bg-white p-4 space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Email:</span>{" "}
          <span className="font-medium">{user?.email ?? "—"}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Role:</span>{" "}
          <span className="font-medium">{user?.role ?? "—"}</span>
        </div>

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}