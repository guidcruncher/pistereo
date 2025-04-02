import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export class ServiceBase {
  private baseUrl: string;

  constructor(baseurl: string) {
    this.baseUrl = baseurl;
  }

  client(options: any = {}) {
    let opt: any = options ?? {};
    if (opt.isPublic) {
      return axios.create({
        baseURL: opt.baseUrl ?? this.baseUrl,
        headers: {
          'Content-type': 'application/json',
        },
      });
    }

    const authStore = useAuthStore();
    const token = authStore.token ?? { access_token: '', refresh_token: '' };

    const client = axios.create({
      baseURL: opt.baseUrl ?? this.baseUrl,
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token.access_token,
      },
    });

    if (!opt.disableInterceptor) {
      this.createAxiosResponseInterceptor(client);
    }

    return client;
  }

  private createAxiosResponseInterceptor(instance: any) {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        let token = JSON.parse(
          localStorage.getItem('token') ??
            '{"access_token": "", "refresh_token": ""}',
        ) || { access_token: '', refresh_token: '' };

        instance.interceptors.response.eject(interceptor);
        const authStore = useAuthStore();
        return instance
          .post('/api/auth/refresh', token)
          .then((response: any) => {
            if (!response.data || !response.data.access_token) {
              authStore.setToken({ access_token: '', refresh_token: '' });
              window.location.href = '/api/auth';
              return;
            }

            authStore.setToken({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            });
            error.response.config.headers['Authorization'] =
              'Bearer ' + response.data.access_token;
            return instance(error.response.config);
          })
          .catch((error2) => {
            // Retry failed, clean up and reject the promise
            authStore.setToken({ access_token: '', refresh_token: '' });
            window.location.href = '/api/auth';
            return Promise.reject(error2);
          })
          .finally(this.createAxiosResponseInterceptor(instance)); // Re-attach the interceptor by running the method
      },
    );
  }
}
