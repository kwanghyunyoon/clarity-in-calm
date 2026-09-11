import { Redirect } from 'expo-router';

// Auth is disabled (see @/lib/auth-flag). This route must stay registered —
// forgot-password.tsx still points Supabase's recovery email link at it —
// but it imports nothing from @/lib/supabase, so this always-mounted route
// never requires that module. Real implementation:
// @/components/auth/ResetPasswordScreen.
export default function ResetPassword() {
  return <Redirect href="/" />;
}
