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

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || import.meta.env.VITE_ACCESS_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
});

export default apiClient;