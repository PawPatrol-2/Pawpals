const LOCAL_API_BASE = "http://localhost:3000";

const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configuredBase && configuredBase.length > 0
    ? configuredBase.replace(/\/+$/, "")
    : LOCAL_API_BASE;

export const replaceLocalhostBase = (url: string) => {
  if (!url.startsWith(LOCAL_API_BASE)) {
    return url;
  }

  return `${API_BASE_URL}${url.slice(LOCAL_API_BASE.length)}`;
};

export const resolveAppUrl = (pathOrUrl: string) => {
  if (!pathOrUrl) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return replaceLocalhostBase(pathOrUrl);
  }

  if (pathOrUrl.startsWith("/")) {
    return `${API_BASE_URL}${pathOrUrl}`;
  }

  return pathOrUrl;
};