export interface Pager {
  offset: number;
  limit: number;
  total: number;
  page: number;
  pageCount: number;
}

export class PagedList<T> {
  paging: Pager;
  items: T[];

static fromArray<U>(items: U[], offset: number, limit: number): PagedList<U> {
let l= new PagedList<U>();
l.paging.offset=offset;
l.paging.limit=limit;
l.paging.total=items.lemgth;
l.paging.page=0;
l.paging.pageCount=Math.ceil(items.length  / (limit-offset));

return l;
}
}
