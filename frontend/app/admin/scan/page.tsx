"use client";

import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import api from "@/lib/axios";

export default function ScanPage() {
  const [result, setResult] = useState("");

  const handleScan = async (value: string) => {
    setResult(value);
    await api.post("/attendance/scan", { qr_token: value });
    alert("Attendance Recorded!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">QR Scanner</h1>

      <QrScanner
        onDecode={(value) => handleScan(value)}
        onError={(error) => console.log(error)}
        containerStyle={{ width: "300px" }}
      />

      <p className="mt-4">Result: {result}</p>
    </div>
  );
}
