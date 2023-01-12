import {
  defineStore,
  type Store,
  type StoreDefinition,
  type _GettersTree,
} from "pinia";
import mock from "../../mock";
import axios from "@/core/plugins/axios";
import config from "@/const";
import type { ID } from "@/types/utils";
import { sleep } from "../../utils";
import type { AxiosResponse } from "axios";
import type { Filters, PaginateResult, PaginateResult2 } from "./types";

export interface makeAPIStoreProps {
  id: string;
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

  filters: {
    page: number;
    pageSize: number;
  };
  totalPages: number;
}

export interface APIStoreActions<T> {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  fetchById: (id: ID, filters?: Filters, applyState?: boolean) => Promise<T>;
  fetchList: (
    filters?: Filters,
    applyState?: boolean
  ) => Promise<PaginateResult2<T>>;
  search: (filters?: Filters) => Promise<Array<T>>;
  update: (id: ID, body: T) => void;
  create: (body: T) => Promise<T>;
}

export interface APIStoreGetters<T> extends _GettersTree<APIStoreStateTree<T>> {
  getList: () => Array<T>;
  getById: () => (id: ID) => T;
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

export function makeAPIStore<T>(props: makeAPIStoreProps): APIStoreDef<T> {
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

  function _getQueryString(q: any, base?: string): string {
    if (!q || typeof q !== "object") {
      return "";
    }

    const queryStrKeys = Object.keys(q);

    const queryStrObj = queryStrKeys
      .filter((key) => typeof q[key] === "object")
      .map((key: string) => {
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
    if (config.IS_MOCK) {
      return {
        data: response,
      } as AxiosResponse<FORMAT_TYPE>;
    } else {
      return response as AxiosResponse<FORMAT_TYPE>;
    }
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

      ...props.state,
    }),
    getters: {
      getList: (state) => state.list,
      getById: (state) => (id: ID) => state.byId[id],
      ...props.getters,
    },
    actions: {
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
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }
        // @ts-ignore
        const response = _formatResponse<T>(
          config.IS_MOCK
            ? mock.getById(_getPath(), id)
            : await axios.get(_getPath({ id, filters: filters || {} }))
        );
        if (applyState) {
          this.byId[id] = response.data;
        }
        return response.data;
      },
      async fetchList(
        filters?: Filters,
        applyState = true
      ): Promise<PaginateResult2<T>> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }

        const _filters = {
          ...(props.filters || {}),
          ...(this.filters || {}),
          ...(filters || {}),
        };

        // @ts-ignore
        const response = _formatResponse<Array<T> | PaginateResult<T>>(
          config.IS_MOCK
            ? mock.getAll(_getPath({ filters: _filters }))
            : await axios.get(_getPath({ filters: _filters }))
        );

        const res: PaginateResult2<T> = {
          results: [],
          totalPages: 1,
        };
        if ((response.data as PaginateResult<T>)?.results) {
          res.results = (response.data as PaginateResult<T>).results;
          res.totalPages = Math.ceil(
            (response.data as PaginateResult<T>).total / _filters.pageSize
          );
        } else {
          res.results = response.data as Array<T>;
        }
        if (applyState) {
          this.list = res.results;
          this.totalPages = res.totalPages;
        }
        return res;
      },
      async search(filters?: Filters): Promise<Array<T>> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }
        // @ts-ignore
        const response = _formatResponse<Array<T> | PaginateResult<T>>(
          config.IS_MOCK
            ? mock.getAll(_getPath({ filters }))
            : await axios.get(_getPath({ filters }))
        );
        if ((response.data as PaginateResult<T>)?.total) {
          return (response.data as PaginateResult<T>).results;
        }
        return response.data as Array<T>;
      },
      async update(id: ID, body: T) {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }
        // @ts-ignore
        const response = _formatResponse<T>(
          config.IS_MOCK
            ? mock.update(_getPath(), id, body)
            : await axios.put(_getPath({ id }), body)
        );
        return response.data;
      },
      async create(body: T): Promise<T> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }

        const response = _formatResponse<T>(
          config.IS_MOCK
            ? mock.add(_getPath(), body)
            : await axios.post(_getPath(), body)
        );
        return response.data;
      },
      ...props.actions,
    },
    persist: props.persist,
  });
}
