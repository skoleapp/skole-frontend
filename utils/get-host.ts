export const getHost = req => {
  if (!req) return '';

  const { host } = req.headers;

  if (host.startsWith('localhost')) {
    return `http://${host}`;
  }
  return `https://${host}`;
};
