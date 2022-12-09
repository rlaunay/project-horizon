import http from "@/libs/http";
import { getTokenFromSession } from "@/libs/session.server";
import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const currentToken = await getTokenFromSession(request);
  if (currentToken !== null ) return json({
    message: 'Not found'
  }, { status: 404 });
  
  const { url } = await http.get<{ url: string }>('/discord/redirect');
  return redirect(url);
}