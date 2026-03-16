"use client";

import { useMemo, useState, type FormEvent } from "react";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import type { ShopCatalogItem } from "@/types/shop-item";
import type { UserProfile } from "@/actions/user/profile.actions";
import { saveProfileSettings } from "./api";
import { buildInventorySummary, buildProfileFormState, getProfileLevelState } from "./utils";
import type { ProfileFormState } from "./types";

export function useProfilePageController(
  initialProfile: UserProfile | null,
  shopItems: ShopCatalogItem[]
) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [formState, setFormState] = useState<ProfileFormState>(() =>
    buildProfileFormState(initialProfile)
  );
  const [isSaving, setIsSaving] = useState(false);

  const inventorySummary = useMemo(
    () => buildInventorySummary(profile, shopItems),
    [profile, shopItems]
  );

  const { levelProgress, levelTitle } = useMemo(
    () => getProfileLevelState(profile),
    [profile]
  );

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResetForm = () => {
    setFormState(buildProfileFormState(profile));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      const result = await saveProfileSettings(formState);
      if (!result.success) {
        throw new Error(result.message ?? "Cập nhật thất bại.");
      }

      const updatedProfile = result.data ?? profile;
      setProfile(updatedProfile);
      setFormState(buildProfileFormState(updatedProfile));
      toast.success("Đã cập nhật hồ sơ.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật hồ sơ."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  return {
    profile,
    formState,
    isSaving,
    inventorySummary,
    levelProgress,
    levelTitle,
    handleFieldChange,
    handleResetForm,
    handleSubmit,
    handleSignOut,
  };
}
