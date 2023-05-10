import { useEffect, useState } from "react";

interface TConfigObject {
  axiosInstance: any;
  method: string;
  url: string;
  requestConfig: any;
}

const useAxios = (configObj: TConfigObject): [any, any, any] => {
  const { axiosInstance, method, url, requestConfig = {} } = configObj;

  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await axiosInstance[method.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal,
        });
        console.log(res);
        setResponse(res.data);
      } catch (err: any) {
        console.log(err);
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  return [response, error, loading];
};

export default useAxios;
