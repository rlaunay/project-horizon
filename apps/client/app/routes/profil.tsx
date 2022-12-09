import { requireTokenSession } from "@/libs/session.server";
import { useSession } from "@/modules/auth/hooks/useSession"
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  await requireTokenSession(request);
  return null;
}

export default function Profil() {
  const user = useSession();
  return (
    <>
      <h1>Profil</h1>
      <p>{user?.username}</p>
    </>
  )
}