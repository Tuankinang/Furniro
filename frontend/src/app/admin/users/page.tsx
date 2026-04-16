"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuthStore(); // lấy thông tin user đang đăng nhập hiện tại

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users/admin/all?search=${search}`);
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setHasFetched(true);
    }
  };

  useEffect(() => {
    // Nếu ô tìm kiếm trống (lúc mới vào trang), tải ngay lập tức
    if (search === "") {
      fetchUsers();
    } else {
      // Chỉ khi đang gõ tìm kiếm mới đợi 0.5s để giảm tải cho server
      const delayDebounceFn = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this account? This action cannot be undone!",
      )
    )
      return;
    try {
      await api.delete(`/users/admin/${userId}`);
      toast.success("✅ Account deleted successfully!");
      fetchUsers();
    } catch (err: any) {
      toast.error("❌ Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage customer accounts and users in the system
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B88E2F]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold text-center">Role</TableHead>
                <TableHead className="font-bold text-center">
                  Orders
                </TableHead>
                <TableHead className="font-bold text-center">
                  Joined Date
                </TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasFetched && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u: any) => (
                  <TableRow key={u.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Avatar placeholder (chữ cái đầu) */}
                        <div className="w-10 h-10 rounded-full bg-[#F9F1E7] text-[#B88E2F] flex items-center justify-center font-bold uppercase shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex flex-col max-w-[200px]">
                          <span className="font-semibold text-sm truncate">
                            {u.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                        variant="outline"
                      >
                        {u.role === "ADMIN" ? "Admin" : "Customer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium">
                      {u._count?.orders > 0 ? (
                        <span className="text-[#B88E2F] font-bold">
                          {u._count.orders} order{u._count.orders !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">0 orders</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        {/* Không cho tự xóa chính mình */}
                        {currentUser?.id === u.id ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-600 border-transparent shadow-none"
                          >
                            You
                          </Badge>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
