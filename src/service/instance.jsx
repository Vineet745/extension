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
      "a2d23c419855e4a6536c791202d77c197698d5738a4e304c919699186476";

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
