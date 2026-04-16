import TableSkeleton from "@/components/ui/TableSkeleton";

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Order Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          View list and update system order statuses.
        </p>
      </div>

      <TableSkeleton columns={6} rows={5} />
    </div>
  );
}
