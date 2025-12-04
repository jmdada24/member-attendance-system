"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AttendancePage() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await api.get("/attendance");
    setLogs(res.data.attendance);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Attendance Logs</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Plan</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l: any) => (
            <tr key={l.id}>
              <td className="border p-2">{l.user.name}</td>
              <td className="border p-2">{l.user.plan}</td>
              <td className="border p-2">{l.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
