import { destroyUserSession, requireTokenSession } from "@/libs/session.server";
import { logout } from "@/modules/auth/services/user.server";
import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({request}) => {

  if (request.method !== 'DELETE') {
    throw json({ message: 'Not found' }, { status: 404 })
  }

  const token = await requireTokenSession(request);
  await logout(token);

  return destroyUserSession(request);
}