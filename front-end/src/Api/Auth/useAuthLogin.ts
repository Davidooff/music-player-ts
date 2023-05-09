import useAxios from "axios-hooks";
import { UserPayload } from "../../Types/Auth/Auth";

const URL = 'http://localhost:3000/auth/register';

interface TReturn {
    loginResponse: any,
    loginError: any,
    loginLoading: boolean,
    loginFetch: () => void
}

export const useAuthLogin = (postData: UserPayload): TReturn => {
    const [{ data, loading, error }, refetch] = useAxios({
        url: URL,
        method: 'POST',
        options: {
            data: postData
        }
    } as any, {
        manual: true
    });

    return {
        loginResponse: data,
        loginError: error,
        loginLoading: loading,
        loginFetch: refetch
    };
}