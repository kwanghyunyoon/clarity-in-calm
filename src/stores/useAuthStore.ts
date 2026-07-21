import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    // OPTIONAL INTEGRATION POINT — restored session on cold start.
    // e.g. link local device data (journal / emotion history) to session.user.id.
    // Clarity in Calm is fully free, so there is no purchases SDK identity to sync.

    supabase.auth.onAuthStateChange((event, nextSession) => {
      set({ session: nextSession, user: nextSession?.user ?? null });

      if (event === 'SIGNED_IN' && nextSession?.user) {
        // OPTIONAL INTEGRATION POINT — user just signed in.
        // e.g. claimLocalDataForUser(nextSession.user.id).
      } else if (event === 'SIGNED_OUT') {
        // OPTIONAL INTEGRATION POINT — user just signed out.
        // e.g. clear local caches tied to the account.
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));

// Auto-initialize on module load so the Settings screen can read session/loading immediately.
void useAuthStore.getState().init();
