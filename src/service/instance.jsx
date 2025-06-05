import axios from "axios";

const instance = axios.create({
  baseURL: "https://plugin.saversbudget.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
  timeoutErrorMessage: "Request Timed Out",
});

instance.interceptors.request.use(
  async (config) => {
    //     const token = await getToken();
    const token =
      "35e88bdf54ad3f3a4a8f94cbe0404bc20c805e77a7e4b6b003a8817e1271";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
