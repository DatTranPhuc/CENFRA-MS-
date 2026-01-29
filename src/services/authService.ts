import api from '@/lib/axios';
import { mockAuthService } from './mockAuthService';
import type { LoginResponse } from '@/Types/LoginResponse';

const USE_MOCK = import.meta.env.MODE === 'development';
export const authService = {
  signIn: async (username: string, password: string): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return await mockAuthService.signIn(username, password);
    }
    return {} as LoginResponse;

    // dùng khi production -> gọi api thật
    // const res = await api.post('auth/signin', { username, password }, { withCredentials: true });
    // return res.data;
  },
};
