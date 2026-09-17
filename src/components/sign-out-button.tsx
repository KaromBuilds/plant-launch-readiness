"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-neutral-400 transition hover:text-neutral-100"
    >
      Sign out
    </button>
  );
}
