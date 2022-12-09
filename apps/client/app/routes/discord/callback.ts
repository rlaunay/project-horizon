import { API_URL } from "@/data/constants";
import http from "@/libs/http";
import { createUserSession, getTokenFromSession } from "@/libs/session.server";
import type { LoaderArgs} from "@remix-run/node";
import { json} from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({request}: LoaderArgs) {
  const currentToken = await getTokenFromSession(request);
  if (currentToken !== null ) return json({
    message: 'Not found'
  }, { status: 404 });

  const requestUrl = new URL(request.url);

  if (!requestUrl.searchParams.get('code')) return redirect('/');

  const url = new URL(`${API_URL}/discord/callback`);
  url.search = requestUrl.search;

  const { token } = await http.get<{ token: string }>(url.toString());

  return createUserSession(token, '/');
}