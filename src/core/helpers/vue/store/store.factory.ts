import { defineStore } from "pinia";
import mock from "../../mock";
import axios from "../../../plugins/axios";
import { IS_MOCK, MOCK_DURATION } from "@/const";
import type { ID } from "@/features/types/utils";
import { sleep } from "../../utils";

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
  function _getPath(id?: ID, resource?: string) {
    let resPath = "";
    resPath = props.path ? `${props.path}` : `/${props.id}`;
    if (id) {
      resPath += `/${id}`;
    }

    if (resource) {
      resPath += `/${resource}`;
    }
    return resPath;
  }

  return defineStore({
    id: props.id,
    state: () => ({
      list: [] as Array<T>,
      byId: {} as { [key: ID]: T },
      resources: {} as { [name: string]: { [key: ID]: any } },
      ...props.state,
    }),
    getters: {
      getList: (state) => state.list,
      getById: (state) => (id: ID) => state.byId[id],
      ...props.getters,
    },
    actions: {
      async fetchById(id: ID): Promise<T> {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: T = IS_MOCK
          ? mock.getById(_getPath(), id)
          : await axios.get(_getPath(id));
        this.byId[id] = response;
        return response;
      },
      async fetchResourceById(id: ID, resource: string): Promise<any> {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: any = IS_MOCK
          ? mock.getAll(_getPath(id, resource))
          : await axios.get(_getPath(id, resource));
        //this.byId[id] = response;
        return response;
      },
      async fetchAll(): Promise<T> {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: T = IS_MOCK
          ? mock.getAll(_getPath())
          : await axios.get(_getPath());
        this.list = response;
        return response;
      },
      async create(body: T) {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: T = IS_MOCK
          ? mock.add(_getPath(), body)
          : await axios.post(_getPath(), body);
        return response;
      },
      async update(id: ID, body: T) {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: T = IS_MOCK
          ? mock.update(_getPath(), id, body)
          : await axios.put(_getPath(id), body);
        return response;
      },
      async delete(id: ID) {
        IS_MOCK && (await sleep(MOCK_DURATION));
        // @ts-ignore
        const response: T = IS_MOCK
          ? mock.deleteData(_getPath(), id)
          : await axios.delete(_getPath(id));
        this.byId[id] = undefined;
        delete this.byId[id];
        return response;
      },
      ...props.actions,
    },
    persist: props.persist,
  });
}
