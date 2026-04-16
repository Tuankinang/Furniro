"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/ui/TableSkeleton";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts/admin/all");
      if (res.data.success) setPosts(res.data.data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/admin/${id}`);
      toast.success("Post deleted!");
      fetchPosts();
    } catch {
      toast.error("Error deleting post");
    }
  };

  const handleTogglePublish = async (post: any) => {
    try {
      await api.patch(`/posts/admin/${post.id}`, { published: !post.published });
      toast.success(post.published ? "Post unpublished" : "Post published!");
      fetchPosts();
    } catch {
      toast.error("Error updating post");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-[#B88E2F] rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage blog posts for your customers.
            </p>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Post
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton columns={5} rows={5} />
      ) : (
        <div className="rounded-md border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold w-[350px]">Title</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Author</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No posts yet. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-black line-clamp-1">{post.title}</span>
                        <span className="text-xs text-gray-400 font-mono">{post.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{post.author?.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={post.published
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          title={post.published ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/admin/blog/edit/${post.slug}`}
                          className="flex items-center gap-1 bg-gray-100 hover:bg-[#B88E2F] hover:text-white text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
