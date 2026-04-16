"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/ui/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

const statusMap: any = {
  PENDING: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

// Statuses that admins can transition to (post-approval)
const nextStatusOptions: Record<string, { value: string; label: string }[]> = {
  PROCESSING: [
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "COMPLETED", label: "Completed" },
  ],
  SHIPPED: [
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "COMPLETED", label: "Completed" },
  ],
  DELIVERED: [
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "COMPLETED", label: "Completed" },
  ],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err: any) {
      toast.error(
        "Update failed: " +
          (err?.response?.data?.message || "Unknown error"),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const renderActions = (order: any) => {
    const isUpdating = updatingId === order.id;

    // Pending orders: Show ✓ Approve and ✗ Cancel buttons
    if (order.status === "PENDING") {
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={isUpdating}
            onClick={() => order.id && handleUpdateStatus(order.id as string, "PROCESSING")}
            title="Approve order"
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            disabled={isUpdating}
            onClick={() => {
              if (order.id && confirm("Are you sure you want to cancel this order?")) {
                handleUpdateStatus(order.id as string, "CANCELLED");
              }
            }}
            title="Cancel order"
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </button>
        </div>
      );
    }

    // Cancelled or Completed orders: No actions available
    if (order.status === "CANCELLED" || order.status === "COMPLETED") {
      return (
        <span className="text-xs text-gray-400 italic ml-auto block text-right">
          {order.status === "CANCELLED" ? "—" : "Customer received"}
        </span>
      );
    }

    // Processing / Shipped / Delivered: Select for next status transitions
    const options = order.status ? (nextStatusOptions[order.status] ?? []) : [];
    if (options.length === 0) return null;

    return (
      <Select
        value=""
        onValueChange={(val: string | null) => { if (val && order.id != null) handleUpdateStatus(String(order.id), val); }}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[150px] h-8 ml-auto">
          <SelectValue placeholder="Update status..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Order Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          View and update the status of all orders in the system.
        </p>
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={5} />
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold text-center">
                  Order Date
                </TableHead>
                <TableHead className="font-bold text-right">
                  Total
                </TableHead>
                <TableHead className="font-bold text-center">
                  Status
                </TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.user?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[#B88E2F]">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={statusMap[order.status]?.color}
                      variant="outline"
                    >
                      {statusMap[order.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {renderActions(order)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
