import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { accounts: true, Company: true },
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
  try {
    // Ensure the user exists
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Update the user's profile
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: data.name || existingUser.name,
        profilePicUrl: data.profilePicUrl || existingUser.profilePicUrl,
        Company: {
          upsert: {
            update: {
              name: data.companyName || existingUser.Company?.name || "",
            },
            create: {
              name: data.companyName || "",
            },
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}
