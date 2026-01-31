import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function ensureAuthenticated() {
    const session = await getSession();
    if (!session?.user?.id) {
        throw new Error("Unauthorized.");
    }
    return session;
}

export async function ensureAdminSession() {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
        throw new Error("Unauthorized.");
    }
    return session;
}
