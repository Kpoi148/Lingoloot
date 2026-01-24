import { getUserProfile } from "@/actions/profile.actions";
import { getShopItems } from "@/actions/shop.actions";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let profile = null;
  let error: string | null = null;
  let shopItems: any[] = [];

  try {
    const [fetchedProfile, fetchedShopItems] = await Promise.all([
      getUserProfile(),
      getShopItems(),
    ]);
    profile = fetchedProfile;
    shopItems = fetchedShopItems;
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Không thể tải thông tin hồ sơ.";
  }

  return <ProfileClient initialProfile={profile} initialError={error} shopItems={shopItems} />;
}
