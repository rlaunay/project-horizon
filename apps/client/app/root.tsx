import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "@/styles/app.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
]

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Horizon JDR",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="fr">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="salut" >Salut</div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
