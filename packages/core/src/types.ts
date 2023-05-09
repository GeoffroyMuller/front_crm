import type { Store } from "pinia";
import type { RouteRecordRaw } from "vue-router";
import type { APIStore } from "./factories/store.factory";

export type ID = string | number;

export interface PaginateResult<T> {
  results: Array<T>;
  total: number;
}

export interface PaginateResult2<T> {
  results: Array<T>;
  totalPages: number;
}

export type Filters = {
  [key: string]:
    | string
    | number
    | Array<string | number | Filters>
    | Filters
    | undefined
    | null;
};

export type AppModule = {
  name: string;
  routes?: Readonly<RouteRecordRaw>;
  // stores?: Array<Store | APIStore<unknown>>;
};
