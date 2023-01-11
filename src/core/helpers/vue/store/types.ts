export interface PaginateResult<T> {
  results: Array<T>;
  total: number;
}

export interface PaginateResult2<T> {
  results: Array<T>;
  totalPages: number;
}

export type Filters = { [key: string]: string | number };
