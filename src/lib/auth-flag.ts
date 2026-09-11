// Supabase accounts are built but disabled for the initial Play Store release:
// the app's positioning is device-local/encrypted, and accounts pull in Play's
// account-deletion requirement plus a heavier Data safety declaration for a
// feature zero users have asked for yet. Flip this back on when that changes.
//
// Flipping this alone is not enough to re-enable sign-in — AccountSectionAuth
// and the real reset-password screen (see settings.tsx and reset-password.tsx)
// also need to be wired back in.
export const AUTH_ENABLED = false;
