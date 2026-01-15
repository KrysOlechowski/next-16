/**
 * User menu component
 *
 * Shows current user info + logout option
 * Useful for dashboard/authenticated pages
 */

"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogoutButton } from "./LogoutButton";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-10 w-24 bg-gray-200 rounded" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{user.email}</p>
        <p className="text-xs text-gray-500">Authenticated</p>
      </div>
      <LogoutButton />
    </div>
  );
}
