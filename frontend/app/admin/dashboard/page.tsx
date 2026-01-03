export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview (you can add totals: members, today check-ins, expired, etc.)
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Members</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Today Check-ins</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Expired</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>
    </div>
  );
}