export interface Pager {
  offset: number;
  limit: number;
  total: number;
  page: number;
  pageCount: number;
}

export interface PagedList<T> {
  paging: Pager;
  items: T[];
}

export interface oAuthResponse {
  grant_type: string;
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface ApiError {
  err: string;
  url: string;
}

export interface ApiResult<T> {
  status: number;
  statusText: string;
  result: T;
}
