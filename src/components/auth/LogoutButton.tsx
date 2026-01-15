/**
 * Logout button component
 *
 * Simple button that calls /api/auth/sign-out
 * Can be used in header/navbar
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="outline">
      {loading ? "Logging out..." : "Log Out"}
    </Button>
  );
}
