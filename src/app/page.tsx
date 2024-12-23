"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import router from "next/router";
import { useEffect } from "react";

export default function AppHome() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to dashboard if authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    console.log(session);
    return <div>Loading...</div>;
  }
  if (status === "authenticated") {
    console.log(session);
    redirect("/dashboard");
  }
  if (status === "unauthenticated") {
    console.log(session);
    redirect("/login");
  }
  return null;
}
