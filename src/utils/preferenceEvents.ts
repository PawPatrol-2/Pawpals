export type UserPreferences = {
  preferredAnimalType?: string;
  preferredMaxAge?: number;
  preferredPersonality?: string;
  housingType?: string;
  preferredChildFriendly?: boolean;
};

export const USER_PREFERENCES_UPDATED_EVENT = "user-preferences-updated";

export function notifyUserPreferencesUpdated(preferences: UserPreferences): void {
  window.dispatchEvent(
    new CustomEvent<UserPreferences>(USER_PREFERENCES_UPDATED_EVENT, {
      detail: preferences,
    }),
  );
}
