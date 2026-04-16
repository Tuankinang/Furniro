import prisma from "../config/prisma";

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const skip = (page - 1) * limit;

  const whereCondition = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
    }),
    prisma.user.count({ where: whereCondition }),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteUser = async (id: string) => {
  // Kiểm tra xem đối tượng có tồn tại không
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // Không cho phép xóa chính ADMIN cuối cùng hoặc tự xóa (sẽ xử lý logic ở controller nếu cần)

  await prisma.user.delete({ where: { id } });
  return { success: true };
};
