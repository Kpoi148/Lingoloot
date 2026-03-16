import { updateUserProfile } from "@/actions/user/profile.actions";
import type { ProfileFormState } from "./types";

// This function normalizes client form state into the server action payload.
export async function saveProfileSettings(formState: ProfileFormState) {
  const payload = new FormData();
  const nameValue = formState.displayName.trim();

  if (nameValue) {
    payload.append("name", nameValue);
    payload.append("displayName", nameValue);
  }

  payload.append("bio", formState.bio);
  payload.append("avatarUrl", formState.avatarUrl);

  return updateUserProfile(payload);
}
