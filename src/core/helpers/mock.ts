import type { ID } from "@/features/types/utils";
import mock from "@/mock.json";
import { merge, uniqueId } from "lodash";

interface IDB {
  [key: string]: any;
}

function initDB(): IDB {
  return Object.keys(mock.GET).reduce((prev, url: string) => {
    const data: any = mock.GET[url];
    if (Array.isArray(data)) {
      return {
        ...prev,
        [url]: data.reduce((prevData, current) => {
          return {
            ...prevData,
            [current?.id || _generateID()]: current,
          };
        }, {}),
      };
    }
    return prev;
  }, {});
}

const DB = initDB();

function _generateID() {
  return Date.now() + uniqueId();
}

function getAll(model: string) {
  return Object.values(DB[model]);
}

function getById(model: string, id: ID) {
  return DB[model][id];
}

function update(model: string, id: ID, body: any) {
  DB[model][id] = merge(DB[model][id], body);
  return DB[model][id];
}

function add(model: string, body: any) {
  const data = { ...body };
  data.id = _generateID();
  DB[model][data.id] = data;
  return data;
}

function deleteData(model: string, id: ID) {
  delete DB[model][id];
}

export default {
  getAll,
  getById,
  add,
  deleteData,
  update,
  mock,
  DB,
};
