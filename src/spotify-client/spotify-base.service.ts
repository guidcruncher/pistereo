import { ApiError, ApiResult, PagedList } from './spotify-client.d';
import { Logger } from '@nestjs/common';
import { ServiceBase } from '@/service-base';

export class SpotifyBaseService extends ServiceBase {
  private readonly logger = new Logger(SpotifyBaseService.name);

  constructor() {
    super();
  }

  public createPagedList<T>(json: any): PagedList<T> {
    let obj: PagedList<T> = {} as PagedList<T>;

    obj.paging = {
      offset: json.offset,
      limit: json.limit,
      total: json.total,
      page: 1,
      pageCount: 0,
    };
    obj.items = json.items as T[];
    if (obj.paging.offset > 0) {
      obj.paging.page = obj.paging.offset / obj.paging.limit + 1;
    }
    obj.paging.pageCount = Math.ceil(obj.paging.total / obj.paging.limit);
    return obj;
  }

  private async createError(response): Promise<ApiResult<ApiError>> {
    let error: ApiResult<ApiError> = {} as ApiResult<ApiError>;
    let txt: any = await response.text();
    let err: any = JSON.parse(txt);
    error.status = response.status;
    error.statusText = response.statusText;
    error.result = { err: err, url: response.url };
    return error;
  }

  private async getResponseLength(response): Promise<number> {
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      return Number(contentLength);
    }

    const payload = await response.clone().arrayBuffer();
    return payload.byteLength;
  }

  public async createPagedResponse<T>(
    response,
    propName: string = '',
  ): Promise<ApiResult<any>> {
    if (!response.ok) {
      return await this.createError(response);
    }

    let result: ApiResult<PagedList<T>> = {} as ApiResult<PagedList<T>>;
    let resultLength: number = await this.getResponseLength(response);
    result.status = response.status;
    result.statusText = response.statusText;

    if (resultLength > 0) {
      try {
        let json: any = await response.json();
        if (propName && propName != '') {
          result.result = this.createPagedList<T>(json[propName]);
        } else {
          result.result = this.createPagedList<T>(json);
        }
      } catch (err) {
        this.logger.error('Error parsing response', err);
      }
    }

    return result;
  }

  public async createResponse<T>(response): Promise<ApiResult<any>> {
    if (!response.ok) {
      return await this.createError(response);
    }

    let result: ApiResult<T> = {} as ApiResult<T>;
    let resultLength: number = await this.getResponseLength(response);
    result.status = response.status;
    result.statusText = response.statusText;

    if (resultLength > 0) {
      try {
        let json: any = await response.json();
        result.result = json as T;
      } catch (err) {
        this.logger.error('Error parsing response', err);
      }
    }

    return result;
  }
}
