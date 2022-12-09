import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import styles from "@/styles/app.css";
import { getTokenFromSession } from "./libs/session.server";
import { getUser } from "./modules/auth/services/user.server";
import { useSession } from "./modules/auth/hooks/useSession";

type DocumentProps = PropsWithChildren<{
  title?: string;
}>

function Document({ children, title }: DocumentProps) {
  const user = useSession();
  return (
    <html lang="fr">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <li>
                <Link to="/profil">Profil</Link>
              </li>
            ) : null}
            {user ? (
              <li>
                <Form action="/discord/logout" method="delete" id="logout-form">
                  <button>Logout</button>
                </Form>
              </li>
            ) : (
              <li>
                <Link to="/discord/redirect">Se connecter</Link>
              </li>
            )}
          </ul>
        </nav>
        <main>
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export async function loader({ request }: LoaderArgs) {
  const token = await getTokenFromSession(request);
  if (!token) return null;

  const user = await getUser(token);
  return user;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
]

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Horizon JDR",
  decription: 'Retrouvez sur Horizon JDR une application web ou vous trouverez des JDR de tout horizon !',
  viewport: "width=device-width,initial-scale=1",
});