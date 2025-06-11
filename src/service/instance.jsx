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
      "0ad168c206da2b383b8ff1110d471544e8114d22f26caf543a973e3ff572";

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
