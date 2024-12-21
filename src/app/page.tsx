import { redirect } from "next/navigation";

export default function AppHome() {
  redirect("/dashboard"); // Automatically redirect to /dashboard
  return null; // Return nothing since the redirect will take over
}
