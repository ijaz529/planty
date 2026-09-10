const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800",
  active: "bg-leaf-soft text-leaf",
  cancelled: "bg-line text-muted",
};

const LABELS: Record<string, string> = {
  pending: "Awaiting payment",
  active: "Active",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] ?? ""}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
