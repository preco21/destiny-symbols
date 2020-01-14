import join from 'url-join'

export function endpoint() {
  return process.env.API_ENDPOINT as string
}

export function apibase(path: string) {
  return join(endpoint(), path)
}
