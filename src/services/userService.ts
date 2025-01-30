import prisma from "@/app/libs/prismadb";
import { CustomToken, User, Role } from "@/types/ad";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { accounts: true, company: true },
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => bcrypt.compare(password, hashedPassword);

export const createUser = async (
  name: string,
  email: string,
  password?: string,
  role: Role = Role.OWNER // Default role to OWNER for SSP users
) => {
  return await prisma.$transaction(async (prisma) => {
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

    const hashedPassword = password
      ? await bcrypt.hash(password, 12)
      : undefined;

    return prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        profilePicUrl: "",
      },
    });
  });
};

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  companyName?: string;
  profilePicUrl?: string;
  role?: Role;
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
        role: data.role ?? existingUser.role,
        company: data.companyName
          ? {
              upsert: {
                update: { name: data.companyName },
                create: {
                  name: data.companyName,
                },
                where: {
                  userId: existingUser.id,
                },
              },
            }
          : undefined,
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

  if (!token?.user?.email) {
    throw new Error("Unauthorized: No token found");
  }

  const user = await findUserByEmail(token.user.email);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePicUrl: user.profilePicUrl ?? "",
    company: user.company
      ? { id: user.company.id, name: user.company.name }
      : null,
    role: user.role as Role,
  };
}
