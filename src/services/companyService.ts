import prisma from "@/app/libs/prismadb";
import { Company } from "@/types/ad";

// Create company
export const createCompany = async (company: Company, userId: string) => {
  return await prisma.company.create({
    data: {
      name: company.name,
      userId: userId,
    },
  });
};
