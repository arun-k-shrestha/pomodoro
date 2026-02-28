import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return session.user as {
    email: string;
    name?: string | null;
    image?: string | null;
  };
}
