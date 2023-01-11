import { defineStore } from "pinia";
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
  filters?: {
    [key: string]: string | string[];
  };

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
    const queryStrString = queryStrKeys
      .filter((key) => !Array.isArray(queryObject[key]))
      .map((key) => `${key}=${queryObject[key]}`)
      .join("&");
    const queryStrArr = queryStrKeys
      .filter((key) => Array.isArray(queryObject[key]))
      .map((key, index) =>
        queryObject[key]
          .map((str: string) => `${key}[${index}]=${str}`)
          .join("&")
      )
      .join("&");
    return (
      "?" +
      queryStrString +
      (queryStrString?.length ? `&${queryStrArr}` : queryStrArr)
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
