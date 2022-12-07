// todo: get consts from .env
const config = {
  API_URL: "http://localhost:3002",
  IS_MOCK: false,
  MOCK_DURATION: 500,
  MOCK_ERROR: {
    fetch: undefined,
    update: undefined,
    delete: undefined,
    add: undefined,
  },
};

export default config;
