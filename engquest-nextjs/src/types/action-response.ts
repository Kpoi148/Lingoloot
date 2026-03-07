// Shared TypeScript shape for server action success and error responses.
export type ActionResponse<T = null> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
};
