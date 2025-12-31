import { getUserProfile } from "@/actions/profile.actions";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let profile = null;
  let error: string | null = null;

  try {
    profile = await getUserProfile();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Không thể tải thông tin hồ sơ.";
  }

  return <ProfileClient initialProfile={profile} initialError={error} />;
}
