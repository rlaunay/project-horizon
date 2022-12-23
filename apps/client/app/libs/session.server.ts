import { createCookieSessionStorage, json, redirect } from "@remix-run/node";

const SESSION_SECRET = 'sdnvdsnjdsjnnvldsnlvds';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secrets: [SESSION_SECRET],
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 30 days
  }
});

export async function createUserSession(token: string, redirectPath: string) {
  const session = await sessionStorage.getSession();
  session.set('token', token);
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  })
}

export async function getTokenFromSession(request: Request): Promise<string | null> {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return null;
  }

  return token;
}

export async function requireTokenSession(request: Request) {
  const token = await getTokenFromSession(request);
  if (!token) throw json({
    message: 'Not found'
  }, {
    status: 404
  });

  return token;
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}