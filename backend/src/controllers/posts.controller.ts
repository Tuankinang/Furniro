import { Request, Response } from "express";
import * as postsService from "../services/posts.service";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/auth.middleware";

// Upload cover image to Cloudinary
export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as any;
  if (!file) {
    res.status(400).json({ success: false, message: "No image file provided" });
    return;
  }
  res.json({ success: true, url: file.path });
});

export const listPublishedPosts = catchAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const data = await postsService.getPublishedPosts(page, limit, category);
    res.json({ success: true, ...data });
  },
);

export const getPost = catchAsync(async (req: Request, res: Response) => {
  const slug =
    typeof req.params.slug === "string" ? req.params.slug : req.params.slug;
  const post = await postsService.getPostBySlug(slug);
  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
    return;
  }
  res.json({ success: true, data: post });
});

export const listCategories = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await postsService.getCategories();
    res.json({ success: true, data });
  },
);

export const listRecentPosts = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await postsService.getRecentPosts();
    res.json({ success: true, data });
  },
);

// ─── ADMIN ────────────────────────────────────────────────
export const listAllPostsAdmin = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await postsService.getAllPostsAdmin();
    res.json({ success: true, data });
  },
);

export const createPost = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const authorId = req.user?.id;
    if (!authorId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { title, slug, excerpt, content, imageUrl, category, published } =
      req.body;
    if (!title || !slug || !content) {
      res.status(400).json({
        success: false,
        message: "title, slug, and content are required",
      });
      return;
    }
    const post = await postsService.createPost({
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      category: category || "General",
      published: published === true || published === "true",
      authorId,
    });
    res.status(201).json({ success: true, data: post });
  },
);

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const post = await postsService.updatePost(req.params.id, req.body);
  res.json({ success: true, data: post });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  await postsService.deletePost(req.params.id);
  res.json({ success: true, message: "Post deleted" });
});

export const getPostAdmin = catchAsync(async (req: Request, res: Response) => {
  const slug =
    typeof req.params.slug === "string" ? req.params.slug : req.params.slug;
  const post = await postsService.getPostBySlugAdmin(slug);
  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
    return;
  }
  res.json({ success: true, data: post });
});
