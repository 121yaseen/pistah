import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createUser = async (
  name: string,
  email: string,
  password?: string
) => {
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};
