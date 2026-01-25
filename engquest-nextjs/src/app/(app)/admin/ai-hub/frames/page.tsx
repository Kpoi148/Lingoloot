import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import FrameGenerator from "@/components/ai-hub/FrameGenerator";
import { getUserProfile } from "@/actions/profile.actions";
import { Sparkles, Wand2 } from "lucide-react";

export default async function AIFrameGeneratorPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const userProfile = await getUserProfile();

    return (
        <div className="space-y-6">


            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                <FrameGenerator userAvatarUrl={userProfile?.avatarUrl} />
            </div>
        </div>
    );
}
