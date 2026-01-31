import customAxios from '@axios/customAxios';
import {getAccessToken} from '../../screens/auth/auth/token';
import {API_PREFIX} from '@env';
import {useQuery} from '@tanstack/react-query';

export const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await customAxios.get(`${API_PREFIX}/users/me`);

      if (response.status !== 200)
        throw new Error('Failed to fetch user profile');

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
