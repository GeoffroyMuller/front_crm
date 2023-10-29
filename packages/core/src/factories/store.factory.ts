import {
  defineStore,
  type Store,
  type StoreDefinition,
  type _GettersTree,
} from "pinia";
import type { ID } from "../types";
import axios, { type AxiosResponse } from "axios";
import type { Filters, PaginateResult, PaginateResult2 } from "../types";
import { cloneDeep, merge } from "lodash";

export interface makeAPIStoreProps {
  id?: string;
  // if path is different of the id
  path?: string;

  persist?: boolean;
  filters?: Filters;

  // todo : need to be typed
  actions?: any;
  getters?: any;
  state?: any;
}

export interface APIStoreStateTree<T> {
  list: Array<T>;
  byId: { [key: ID]: T };

  filters: Filters & {
    page: number;
    pageSize: number;
  };
  totalPages: number;
}

export interface APIStoreActions<T> {
  setFilters: (f: Filters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  fetchById: (id: ID, filters?: Filters, applyState?: boolean) => Promise<T>;
  fetchList: (
    filters?: Filters,
    applyState?: boolean,
    signal?: AbortSignal
  ) => Promise<PaginateResult2<T>>;
  search: (filters?: Filters, signal?: AbortSignal) => Promise<Array<T>>;
  update: (id: ID, body: Partial<T>) => Promise<T>;
  create: (body: Partial<T>) => Promise<T>;
  delete: (id: ID) => Promise<T>;

  getDerivedStore: <M>(
    id: ID,
    relation: string,
    p?: makeAPIStoreProps
  ) => APIStore<M>;
}

export interface APIStoreGetters<T> extends _GettersTree<APIStoreStateTree<T>> {
  getList: () => Array<T>;
  getById: () => (id: ID) => T | undefined;
}

export type APIStoreDef<T> = StoreDefinition<
  string,
  APIStoreStateTree<T>,
  APIStoreGetters<T>,
  APIStoreActions<T>
>;

export type APIStore<T> = Store<
  string,
  APIStoreStateTree<T>,
  APIStoreGetters<T>,
  APIStoreActions<T>
>;

export function makeAPIStore<T>(
  props: makeAPIStoreProps & { id: string }
): APIStoreDef<T> {
  function _getPath({
    id,
    resource,
    filters,
  }: {
    id?: ID;
    resource?: string;
    filters?: Filters;
  } = {}) {
    let resPath = "";
    resPath = props.path ? `${props.path}` : `/${props.id}`;
    if (id) {
      resPath += `/${id}`;
    }

    if (resource) {
      resPath += `/${resource}`;
    }

    const queryString = _getQueryString(filters);
    if (queryString) {
      resPath += `?${queryString}`;
    }

    return resPath;
  }

  function _getQueryString(q?: Filters, base?: string): string {
    if (!q || typeof q !== "object") {
      return "";
    }

    const queryStrKeys = Object.keys(q);

    const queryStrObj = queryStrKeys
      .filter((key) => typeof q[key] === "object")
      .map((key: string) => {
        // @ts-ignore
        return _getQueryString(q[key], base ? `${base}[${key}]` : key);
      });
    const queryStrString = queryStrKeys
      .filter((key) => typeof q[key] !== "object")
      .map((key: string) => {
        if (base) {
          return `${base}[${key}]=${q[key]}`;
        }
        return `${key}=${q[key]}`;
      });

    return [...queryStrString, ...queryStrObj].join("&");
  }

  function _formatResponse<FORMAT_TYPE>(
    response: any
  ): AxiosResponse<FORMAT_TYPE> {
    return response as AxiosResponse<FORMAT_TYPE>;
  }

  return defineStore<
    string,
    APIStoreStateTree<T>,
    APIStoreGetters<T>,
    APIStoreActions<T>
  >({
    id: props.id,
    state: () => ({
      list: [] as Array<T>,
      byId: {} as { [key: ID]: T },
      a: 1,
      filters: {
        page: 1,
        pageSize: 10,
      },
      totalPages: 1,
      derivedStores: {},

      ...props.state,
    }),
    getters: {
      getList: (state: any) => state.list,
      getById: (state: any) => (id: ID) => state.byId[id],
      getNbFilters: (state: any) => Object.keys(state.filters).length - 2,
      ...props.getters,
    },
    actions: {
      getDerivedStore<M>(
        id: ID,
        relation: string,
        p?: makeAPIStoreProps
      ): APIStore<M> {
        if (this.derivedStores[id] && this.derivedStores[id][relation]) {
          return this.derivedStores[id][relation];
        }
        const useDerivedStore = makeAPIStore<M>({
          id: `${props.id}-${id}-${relation}`,
          path: `${_getPath()}/${id}/${relation}/`,
          ...(p || {}),
        });
        if (this.derivedStores[id] == null) {
          this.derivedStores[id] = {};
        }
        this.derivedStores[id][relation] = useDerivedStore();
        return this.derivedStores[id][relation];
      },
      async setFilters(f: Filters) {
        this.filters = {
          ...f,
          page: this.filters.page,
          pageSize: this.filters.pageSize,
        };
      },
      async setPage(page: number) {
        this.filters.page = page;
        this.fetchList();
      },
      async setPageSize(pageSize: number) {
        this.filters.pageSize = pageSize;
        this.fetchList();
      },
      async fetchById(
        id: ID,
        filters?: Filters,
        applyState = true
      ): Promise<T> {
        // @ts-ignore
        const response = _formatResponse<T>(
          await axios.get(_getPath({ id, filters: filters || {} }))
        );
        if (applyState) {
          this.byId[id] = response.data;
        }
        return response.data;
      },
      async fetchList(
        f?: Filters,
        applyState = true,
        signal?: AbortSignal
      ): Promise<PaginateResult2<T>> {
        const _filters = merge(
          cloneDeep(this.filters),
          merge(cloneDeep(f), cloneDeep(props.filters))
        );

        // @ts-ignore
        const response = _formatResponse<Array<T> | PaginateResult<T>>(
          await axios.get(_getPath({ filters: _filters }), { signal })
        );

        const res: PaginateResult2<T> = {
          results: [],
          totalPages: 1,
        };
        if (Array.isArray((response.data as PaginateResult<T>)?.results)) {
          res.results = (response.data as PaginateResult<T>).results;
          res.totalPages = Math.ceil(
            (response.data as PaginateResult<T>).total / _filters.pageSize
          );
        } else {
          res.results = response.data as Array<T>;
        }
        if (applyState) {
          // @ts-ignore
          this.list = res.results;
          this.totalPages = res.totalPages;
        }
        return res;
      },
      async search(filters?: Filters, signal?: AbortSignal): Promise<Array<T>> {
        // @ts-ignore
        const response = _formatResponse<Array<T> | PaginateResult<T>>(
          await axios.get(_getPath({ filters }), { signal })
        );
        if (Array.isArray((response.data as PaginateResult<T>)?.results)) {
          return (response.data as PaginateResult<T>).results;
        }
        return response.data as Array<T>;
      },
      async update(id: ID, body: T) {
        // @ts-ignore
        const response = _formatResponse<T>(
          await axios.put(_getPath({ id }), body)
        );
        this.byId[id] = merge(this.byId[id], response.data);
        return response.data;
      },
      async create(body: T): Promise<T> {
        const response = _formatResponse<T>(await axios.post(_getPath(), body));
        // @ts-ignore
        this.byId[response.data.id] = response.data;
        return response.data;
      },
      async delete(id: ID): Promise<T> {
        const response = _formatResponse<T>(
          await axios.delete(_getPath({ id }))
        );
        delete this.byId[id];
        return response.data;
      },
      ...props.actions,
    },
    persist: props.persist,
  });
}
