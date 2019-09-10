interface Headers {
  'Content-Type': string;
  Authorization: string;
}

interface TokenConfig {
  headers: Headers;
}

export const tokenConfig = (token: string): TokenConfig => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  };
};
