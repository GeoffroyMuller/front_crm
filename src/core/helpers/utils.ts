export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getJWT(): string | null {
  return localStorage.getItem("jwt");
}

export function setJWT(jwt: string | null): void {
  if (jwt === null) {
    localStorage.removeItem("jwt");
  } else {
    localStorage.setItem("jwt", jwt);
  }
}

export function formatPrice() {
  
}
