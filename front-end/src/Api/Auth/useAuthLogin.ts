import useAxios from "axios-hooks";

const URL = 'http://localhost:3000/auth/register';

export const useAuthLogin = (data: ) => {
    const [{ data, loading, error }, refetch] = useAxios({
        url: URL,
        method: 'POST',
        options: {
            data
        }
    } as AxiosRequestConfig<any>, {
        manual: true
    });


}