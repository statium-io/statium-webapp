function client<T>(endpoint: string, customConfig: RequestInit = {}): Promise<T> {
  const authToken = process.env.REACT_APP_FOOTBALL_DATA_API_AUTH_TOKEN;

  if (authToken === undefined) {
    throw Error(`Please set a $REACT_APP_FOOTBALL_DATA_API_AUTH_TOKEN environment varialbe`);
  }

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'X-Auth-Token': authToken,
    },
    ...customConfig,
  };

  return window
    .fetch(`${process.env.REACT_APP_FOOTBALL_DATA_API_BASE_URL}/${endpoint}`, config)
    .then((response) => response.json());
}

export { client };
