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

export function getContrastYIQ(hexcolor: string) {
  const color = hexcolor.startsWith("#") ? hexcolor.substring(1) : hexcolor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
