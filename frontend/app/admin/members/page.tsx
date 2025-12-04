"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function MembersPage() {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await api.get("/members");
    setMembers(res.data.members);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Members</h1>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">QR</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m: any) => (
            <tr key={m.id}>
              <td className="p-2 border">{m.name}</td>
              <td className="p-2 border">{m.plan}</td>
              <td className="p-2 border">
                <img src={m.qr_path} width={80} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
