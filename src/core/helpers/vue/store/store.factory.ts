import { defineStore } from "pinia";
import mock from "../../mock";
import axios from "@/core/plugins/axios";
import config from "@/const";
import type { ID } from "@/types/utils";
import { sleep } from "../../utils";
import type { AxiosResponse } from "axios";
import type { PaginateResult } from "./types";

export interface makeAPIStoreProps {
  id: string;
  // if path is different of the id
  path?: string;

  persist?: boolean;

  // todo : need to be typed
  actions?: any;
  getters?: any;
  state?: any;
}

export function makeAPIStore<T>(props: makeAPIStoreProps) {
  function _getPath({
    id,
    resource,
    filters,
  }: {
    id?: ID;
    resource?: string;
    filters?: { [key: string]: string };
  } = {}) {
    let resPath = "";
    resPath = props.path ? `${props.path}` : `/${props.id}`;
    if (id) {
      resPath += `/${id}`;
    }

    if (resource) {
      resPath += `/${resource}`;
    }

    resPath += _getQueryString(filters);

    return resPath;
  }

  function _getQueryString(queryObject: any) {
    if (!queryObject) {
      return "";
    }
    const queryStrKeys = Object.keys(queryObject);
    if (queryStrKeys.length === 0) {
      return "";
    }
    return (
      "?" + queryStrKeys.map((key) => `${key}=${queryObject[key]}`).join("&")
    );
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

  return defineStore({
    id: props.id,
    state: () => ({
      list: [] as Array<T>,
      byId: {} as { [key: ID]: T },
      resources: {} as { [name: string]: { [key: ID]: any } },

      filters: {
        page: 1,
        pageSize: 5,
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
      /*
      async fetchResourceById(id: ID, resource: string): Promise<any> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }
        // @ts-ignore
        const response: any = config.IS_MOCK
          ? mock.getAll(_getPath(id, resource))
          : await axios.get(_getPath(id, resource));
        //this.byId[id] = response;
        return response;
      }, */
      async fetchById(id: ID): Promise<T> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }
        // @ts-ignore
        const response = _formatResponse<T>(
          config.IS_MOCK
            ? mock.getById(_getPath(), id)
            : await axios.get(_getPath({ id }))
        );
        this.byId[id] = response;
        return response.data;
      },
      async fetchList(filters?: {
        [key: string]: string;
      }): Promise<PaginateResult<T>> {
        if (config.IS_MOCK) {
          await sleep(config.MOCK_DURATION);
        }

        const _filters = filters
          ? {
              ...filters,
              ...this.filters,
            }
          : this.filters;

        // @ts-ignore
        const response = _formatResponse<Array<T> | PaginateResult<T>>(
          config.IS_MOCK
            ? mock.getAll(_getPath({ filters: _filters }))
            : await axios.get(_getPath({ filters: _filters }))
        );

        if ((response.data as PaginateResult<T>)?.total) {
          this.list = (response.data as PaginateResult<T>).results;
          this.totalPages = Math.ceil(
            (response.data as PaginateResult<T>).total / this.filters.pageSize
          );
          return response.data as PaginateResult<T>;
        } else {
          this.list = response.data as Array<T>;
          this.totalPages = 1;
          return {
            total: 1,
            results: response.data as Array<T>,
          } as PaginateResult<T>;
        }
      },
      async search(filters?: { [key: string]: string }): Promise<Array<T>> {
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
