import api from '@/lib/axios';

export const authService = {
  signIn: async (username: string, password: string) => {
    const res = await api.post('auth/signin', { username, password }, { withCredentials: true });
    return res.data;
  },
};
