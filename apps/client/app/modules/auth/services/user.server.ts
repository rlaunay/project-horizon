import http from "@/libs/http";

export enum Roles {
  user = 'USER',
  gameMaster = 'GAME_MASTER',
  admin = 'ADMIN',
}

export type User = {
 id: number;
 email: string;
 discordId: string;
 username: string;
 avatarUrl: string;
 role: Roles;
}

export async function getUser(token: string) {
  const user = await http.get<User>('/me', { headers: { Authorization: `Bearer ${token}` } });
  return user;
}

export async function logout(token: string) {
  const message = await http.delete<{ message: 'logged out' }>('/discord/logout', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return message;
}