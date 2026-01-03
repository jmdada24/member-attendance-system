"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Pencil, RefreshCw, Archive } from "lucide-react";


type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subscription_type?: string | null;
  subscription_ends_at?: string | null;
  qr_token?: string | null;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRenew, setOpenRenew] = useState(false);

  const [selected, setSelected] = useState<Member | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // forms
  const [createForm, setCreateForm] = useState({ first_name: "", last_name: "", email: "" });
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "", reset_password: false });
  const [renewForm, setRenewForm] = useState({ subscription_type: "monthly", months: 1 });

  const fullName = useMemo(() => {
    if (!selected) return "";
    return `${selected.first_name} ${selected.last_name}`;
  }, [selected]);

  async function fetchMembers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/members");
      setMembers(res.data.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function createMember() {
    setError(null);
    setTempPassword(null);
    try {
      const res = await api.post("/admin/members", createForm);
      setTempPassword(res.data.temp_password ?? null);
      await fetchMembers();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Create failed");
    }
  }

  async function updateMember() {
    if (!selected) return;
    setError(null);
    setTempPassword(null);
    try {
      const res = await api.put(`/admin/members/${selected.id}`, editForm);
      setTempPassword(res.data.temp_password ?? null);
      setOpenEdit(false);
      await fetchMembers();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Update failed");
    }
  }

  async function renewMember() {
    if (!selected) return;
    setError(null);
    try {
      await api.post(`/admin/members/${selected.id}/renew`, renewForm);
      setOpenRenew(false);
      await fetchMembers();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Renew failed");
    }
  }

  async function archiveMember(member: Member) {
    if (!confirm(`Archive ${member.first_name} ${member.last_name}?`)) return;
    setError(null);
    try {
      await api.delete(`/admin/members/${member.id}`);
      await fetchMembers();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Archive failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">Create, update, renew, archive.</p>
        </div>
        <Button onClick={() => { setTempPassword(null); setOpenCreate(true); }}>
          + Add Member
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {tempPassword && (
        <div className="rounded-md border bg-white p-3 text-sm">
          Temporary password (copy now): <span className="font-mono font-semibold">{tempPassword}</span>
        </div>
      )}

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="p-3 text-left text-sm">Name</th>
              <th className="p-3 text-left text-sm">Email</th>
              <th className="p-3 text-left text-sm">Subscription</th>
              <th className="p-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b last:border-b-0">
                <td className="p-3 text-sm">{m.first_name} {m.last_name}</td>
                <td className="p-3 text-sm">{m.email}</td>
                <td className="p-3 text-sm">
                  {m.subscription_type ?? "none"}
                  {m.subscription_ends_at ? ` (ends ${m.subscription_ends_at})` : ""}
                </td>
                <td className="p-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    
                    <Button
                      variant="outline"
                      onClick={() => { setSelected(m); setOpenView(true); }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelected(m);
                        setEditForm({
                          first_name: m.first_name,
                          last_name: m.last_name,
                          email: m.email,
                          reset_password: false,
                        });
                        setOpenEdit(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />

                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelected(m);
                        setRenewForm({ subscription_type: "monthly", months: 1 });
                        setOpenRenew(true);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => archiveMember(m)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-sm text-muted-foreground">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

      {/* Create */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member (temp password)</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={createForm.first_name} onChange={(e) => setCreateForm(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={createForm.last_name} onChange={(e) => setCreateForm(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={createForm.email} onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
              <Button onClick={async () => { await createMember(); }}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {fullName}</div>
            <div><span className="text-muted-foreground">Email:</span> {selected?.email}</div>
            <div><span className="text-muted-foreground">Subscription:</span> {selected?.subscription_type ?? "none"}</div>
            <div><span className="text-muted-foreground">Ends:</span> {selected?.subscription_ends_at ?? "—"}</div>
            <div><span className="text-muted-foreground">QR:</span> <span className="font-mono">{selected?.qr_token ?? "—"}</span></div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpenView(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={editForm.first_name} onChange={(e) => setEditForm(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={editForm.last_name} onChange={(e) => setEditForm(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.reset_password}
                onChange={(e) => setEditForm(p => ({ ...p, reset_password: e.target.checked }))}
              />
              Reset password (generate temp password)
            </label>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button onClick={updateMember}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renew */}
      <Dialog open={openRenew} onOpenChange={setOpenRenew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Membership</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Subscription type</Label>
              <select
                className="w-full border rounded-md h-10 px-3 text-sm"
                value={renewForm.subscription_type}
                onChange={(e) => setRenewForm(p => ({ ...p, subscription_type: e.target.value }))}
              >
                <option value="monthly">monthly</option>
                <option value="student">student</option>
                <option value="annual">annual</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Months</Label>
              <Input
                type="number"
                min={1}
                max={24}
                value={renewForm.months}
                onChange={(e) => setRenewForm(p => ({ ...p, months: Number(e.target.value) }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenRenew(false)}>Cancel</Button>
              <Button onClick={renewMember}>Renew</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}