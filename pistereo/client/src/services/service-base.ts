import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export class ServiceBase {
  client(isPublic: boolean = false) {
    if (isPublic) {
      return axios.create({
        baseURL: '/api',
        headers: {
          'Content-type': 'application/json',
        },
      });
    }

    const authStore = useAuthStore();
    let token: string = authStore.token.access_token ?? '';

    let client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    this.createAxiosResponseInterceptor(client);
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

        instance.interceptors.response.eject(interceptor);
        const authStore = useAuthStore();
        let refreshToken: string = authStore.token.refresh_token ?? '';
        return instance
          .post('/auth/refresh', {
            access_token: authStore.token.access_token,
            refresh_token: refreshToken,
          })
          .then((response: any) => {
            authStore.token = {
              access_token: response.access_token,
              refresh_token: response.refresh_token,
            };
            error.response.config.headers['Authorization'] =
              'Bearer ' + response.data.access_token;
            return instance(error.response.config);
          })
          .catch((error2) => {
            // Retry failed, clean up and reject the promise
            authStore.token = { access_token: '', refresh_token: '' };
            window.location.href = '/';
            return Promise.reject(error2);
          })
          .finally(this.createAxiosResponseInterceptor(instance)); // Re-attach the interceptor by running the method
      },
    );
  }
}
