"use server";

import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "OWNER") {
    throw new Error("Only OWNER can update user roles.");
  }

  const role = formData.get("role") as Role;

  if (!Object.values(Role).includes(role)) {
    throw new Error("Invalid role.");
  }

  if (session.user.id === userId && role !== "OWNER") {
    throw new Error("You cannot remove your own OWNER role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}