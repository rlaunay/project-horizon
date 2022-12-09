import { useMatches } from "@remix-run/react";
import type { User } from "@/modules/auth/services/user.server";

export function useSession() {
  const matches = useMatches();
  const rootLoaderData = matches.find(m => m.id === "root")?.data;

  if (!rootLoaderData) return null;
  return rootLoaderData as User;
}