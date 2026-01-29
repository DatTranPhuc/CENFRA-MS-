import mockLoginResponse, { type LoginResponse } from '@/Types/LoginResponse';

export const mockAuthService = {
  signIn: async (email: string, password: string): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userData = mockLoginResponse[email.toLocaleLowerCase()];

    if (userData && userData.password === password) {
      const token = `mock_token_${userData.user.userId}_${Date.now()}`;
      return {
        token,
        user: userData.user,
        role: userData.user.userRoleId,
      };
    } else {
      console.log('Invalid credentials');
    }
    return Promise.reject('Invalid email or password');
  },
};
