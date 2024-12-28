"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import router from "next/router";
import { useEffect } from "react";
import Loader from "./components/shared/LoaderComponent";

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
    return <Loader isVisible={true} />;
  }
  if (status === "authenticated") {
    redirect("/dashboard");
  }
  if (status === "unauthenticated") {
    redirect("/login");
  }
  return null;
}
