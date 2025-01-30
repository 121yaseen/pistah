import prisma from "@/app/libs/prismadb";
import { CustomToken, User } from "@/types/ad";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { accounts: true, Company: true },
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => bcrypt.compare(password, hashedPassword);

export const createUser = async (
  name: string,
  email: string,
  password?: string
) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    const error = new Error("User with this email already exists");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code = "P2002";
    throw error;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

  return prisma.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
  });
};

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  companyName?: string;
  profilePicUrl?: string;
}

export async function updateUserProfile(
  email: string,
  data: UpdateUserProfileData
) {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new Error("User not found");
  }

  try {
    return await prisma.user.update({
      where: { email },
      data: {
        name: data.name ?? existingUser.name,
        profilePicUrl: data.profilePicUrl ?? existingUser.profilePicUrl,
        Company: {
          upsert: {
            update: {
              name: data.companyName ?? existingUser.Company?.name ?? "",
            },
            create: {
              name: data.companyName ?? "",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

export async function getLoggedInUser(req: NextApiRequest): Promise<User> {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as CustomToken;

  const user = await findUserByEmail(token.user?.email ?? "");

  return {
    id: user?.id ?? "",
    name: user?.name ?? "",
    email: user?.email ?? "",
    profilePicUrl: user?.profilePicUrl ?? "",
    company: {
      id: user?.Company?.id ?? "",
      name: user?.Company?.name ?? "",
    },
  };
}
