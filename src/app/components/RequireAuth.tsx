"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Loader from "./shared/LoaderComponent";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      status === "unauthenticated" &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      router.push("/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return <Loader isVisible={true} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
