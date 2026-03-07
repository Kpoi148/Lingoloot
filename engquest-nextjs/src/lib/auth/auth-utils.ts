// Shared server-side auth helpers for validating learner and admin sessions.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { connectToDatabase } from "@/lib/db/mongodb";

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

/**
 * Result type for action responses
 */
export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; message: string };

/**
 * Higher-order function to wrap server actions with auth + db connection
 * Reduces duplicate auth/db code in every action
 * 
 * @example
 * export const getUserProfile = withAuth(async (userId) => {
 *   const user = await User.findById(userId);
 *   return user;
 * });
 */
export function withAuth<T, Args extends unknown[]>(
    fn: (userId: string, ...args: Args) => Promise<T>
) {
    return async (...args: Args): Promise<ActionResult<T>> => {
        try {
            const session = await getSession();
            if (!session?.user?.id) {
                return { success: false, message: "Bạn cần đăng nhập." };
            }
            await connectToDatabase();
            const data = await fn(session.user.id, ...args);
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Có lỗi xảy ra."
            };
        }
    };
}

/**
 * Higher-order function to wrap admin-only server actions
 * 
 * @example
 * export const deleteUser = withAdmin(async (adminId, userId) => {
 *   await User.findByIdAndDelete(userId);
 *   return { deleted: true };
 * });
 */
export function withAdmin<T, Args extends unknown[]>(
    fn: (adminId: string, ...args: Args) => Promise<T>
) {
    return async (...args: Args): Promise<ActionResult<T>> => {
        try {
            const session = await getSession();
            if (!session?.user?.id || session.user.role !== "admin") {
                return { success: false, message: "Không có quyền truy cập." };
            }
            await connectToDatabase();
            const data = await fn(session.user.id, ...args);
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Có lỗi xảy ra."
            };
        }
    };
}
