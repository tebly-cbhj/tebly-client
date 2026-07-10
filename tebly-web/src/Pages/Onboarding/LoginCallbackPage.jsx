import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';

export default function LoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const isNewUserParam = searchParams.get('is_new_user') === 'true';

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    // 리다이렉트 파라미터의 is_new_user가 부정확할 때가 있어서, 내 프로필 조회로 한 번 더 교차 확인함
    apiClient
      .get('/users/me')
      .then((res) => {
        const isNewUser = res.data?.isNewUser ?? isNewUserParam;
        navigate(isNewUser ? '/signup/terms' : '/', { replace: true });
      })
      .catch(() => {
        navigate(isNewUserParam ? '/signup/terms' : '/', { replace: true });
      });
  }, [searchParams, navigate]);

  return null;
}
