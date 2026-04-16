import prisma from "../config/prisma";

type PostWhereInput = {
  published?: boolean;
  category?: string;
};

// ─── PUBLIC ───────────────────────────────────────────────
export const getPublishedPosts = async (
  page = 1,
  limit = 6,
  category?: string,
) => {
  const where: PostWhereInput = { published: true };
  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.count({ where: where as any }),
  ]);

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };
};

export const getPostBySlug = async (slug: string) => {
  return prisma.post.findFirst({
    where: { slug, published: true } as any,
    include: { author: { select: { name: true } } },
  });
};

export const getCategories = async () => {
  // Raw query to group by category for published posts
  const result: { category: string; count: bigint }[] = await (prisma as any)
    .$queryRaw`
    SELECT category, COUNT(*) as count
    FROM "Post"
    WHERE published = true
    GROUP BY category
    ORDER BY count DESC
  `;
  return result.map((r) => ({
    name: r.category,
    count: Number(r.count),
  }));
};

export const getRecentPosts = async (limit = 5) => {
  return prisma.post.findMany({
    where: { published: true } as any,
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { title: true, slug: true, imageUrl: true, createdAt: true },
  });
};

// ─── ADMIN CRUD ───────────────────────────────────────────
export const getAllPostsAdmin = async () => {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
};

export const createPost = async (data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  category: string;
  published: boolean;
  authorId: string;
}) => {
  return prisma.post.create({ data: data as any });
};

export const updatePost = async (
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    published: boolean;
  }>,
) => {
  return prisma.post.update({ where: { id }, data: data as any });
};

export const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};

export const getPostBySlugAdmin = async (slug: string) => {
  return prisma.post.findUnique({ where: { slug } });
};
