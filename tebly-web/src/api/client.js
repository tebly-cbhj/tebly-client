import axios from 'axios';

function toCamelCase(str) {
  return str.replace(/[-_]([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function convertKeysToCamel(data) {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamel(item));
  }
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [toCamelCase(key), convertKeysToCamel(value)])
    );
  }
  return data;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 토큰 재발급 전용 인스턴스 — apiClient의 401 재시도 로직에 안 걸리게 분리(인터셉터 없음)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || import.meta.env.VITE_ACCESS_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 동시에 여러 요청이 401을 맞아도 재발급은 한 번만 실행되도록 진행 중인 재발급 Promise를 공유
let refreshPromise = null;

function forceLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('리프레시 토큰이 없어요.');

  const res = await refreshClient.post('/auth/token/refresh', { refresh_token: refreshToken });
  if (!res.data?.success) throw new Error(res.data?.message || '토큰 재발급 실패');

  const { accessToken, refreshToken: newRefreshToken } = convertKeysToCamel(res.data.data) ?? {};
  if (!accessToken) throw new Error('재발급 응답에 accessToken이 없어요.');

  localStorage.setItem('accessToken', accessToken);
  if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
  return accessToken;
}

function handleResponseError(error) {
  const { config, response } = error;

  // 401이 아니거나, 이미 재발급 후 재시도한 요청이면 그냥 실패 처리
  if (!response || response.status !== 401 || config?._retry) {
    return Promise.reject(error);
  }
  config._retry = true;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch((err) => {
        forceLogout();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise.then(() => apiClient(config));
}

apiClient.interceptors.response.use((response) => {
  const envelope = response.data;
  const isWrapped = envelope && typeof envelope === 'object' && !Array.isArray(envelope) && 'success' in envelope;

  if (!isWrapped) {
    response.data = convertKeysToCamel(envelope);
    return response;
  }

  if (!envelope.success) {
    return Promise.reject(new Error(envelope.message || 'API 요청 실패'));
  }
  response.data = convertKeysToCamel(envelope.data);
  return response;
}, handleResponseError);

export default apiClient;