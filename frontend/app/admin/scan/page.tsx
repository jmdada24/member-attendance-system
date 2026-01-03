"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useRef, useState } from "react";
import api from "@/lib/axios";

export default function ScanPage() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<string>("");

  const busyRef = useRef(false);
  const lastRef = useRef<string | null>(null);
  const cooldownUntilRef = useRef<number>(0);

  const handleScan = async (codes: any[]) => {
    if (!codes?.length) return;

    const text = codes[0]?.rawValue ?? codes[0]?.text;
    if (!text) return;

    const now = Date.now();
    if (now < cooldownUntilRef.current) return;
    if (busyRef.current) return;
    if (lastRef.current === text) return;

    lastRef.current = text;
    setResult(text);

    busyRef.current = true;
    setStatus("Sending...");

    try {
      const res = await api.post("/admin/scan", { qr_token: text });
      setStatus(res.data?.message ?? "OK");
    } catch (err: any) {
      setStatus(err?.response?.data?.message ?? "Scan failed");
    } finally {
      busyRef.current = false;
      cooldownUntilRef.current = Date.now() + 1200;
      setTimeout(() => (lastRef.current = null), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">QR Scanner</h1>
        <p className="text-sm text-muted-foreground">
          Scans QR and records attendance.
        </p>
      </div>

      <Scanner
        onScan={handleScan}
        onError={(err) => console.error(err)}
        classNames={{
          container: "w-[320px] rounded-lg overflow-hidden",
          video: "rounded-lg",
        }}
      />

      <div className="text-sm">
        <div>
          <span className="text-muted-foreground">Result:</span>{" "}
          <span className="font-mono">{result || "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Status:</span> {status || "—"}
        </div>
      </div>
    </div>
  );
}