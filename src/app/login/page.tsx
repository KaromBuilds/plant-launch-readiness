"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <h1 className="text-lg font-semibold">Plant Launch Readiness</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sign in as a Plant Manager to view your launch readiness panel.
        </p>
        <button
          onClick={handleSignIn}
          className="mt-6 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
