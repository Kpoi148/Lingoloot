import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import FrameGenerator from "@/components/admin/ai-hub/FrameGenerator";
import { getUserProfile } from "@/actions/user/profile.actions";
// Sparkles and Wand2 removed as they are unused


export default async function AIFrameGeneratorPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const userProfile = await getUserProfile();

    return (
        <div className="space-y-6">


            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/20">
                <FrameGenerator userAvatarUrl={userProfile?.avatarUrl} />
            </div>
        </div>
    );
}
