import { API_URL } from "@/data/constants";

async function request<T>(path: string, config: RequestInit): Promise<T> {  
  let finalPath = path;
  if (path.startsWith('/')) {
    finalPath = `${API_URL}${path}`
  }

  console.log(finalPath)

  const request = new Request(finalPath, { 
    ...config,
  })

  const response = await fetch(request)

  const data = await response.json().catch(() => ({}))

  if(!response.ok) {
    // throw new Error(data.message || 'Une erreur est survenue')
    throw new Error('Une erreur est survenue');
  }

  return data;
}

async function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = {method: 'GET', ...config}
  return await request<T>(path, init)
}

async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = {method: 'POST', body: JSON.stringify(body), ...config}
  return await request<U>(path, init)
}

async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = {method: 'PUT', body: JSON.stringify(body), ...config}
  return await request<U>(path, init)
}

async function remove<T>(path: string, config?: RequestInit): Promise<T> {
  const init = {method: 'DELETE', ...config}
  return await request<T>(path, init)
}

const http = {
  get,
  post,
  put,
  delete: remove
}

export default http