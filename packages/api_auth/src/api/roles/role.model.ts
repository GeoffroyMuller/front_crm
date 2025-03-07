import { Model, Pojo } from "objection";
import type { ID, Role as RoleType } from "core_api/types";

export default class Role extends Model implements Partial<RoleType> {
  id?: ID;
  name?: string;
  idCompany?: number;
  rights?: string | string[];

  static get tableName() {
    return "roles";
  }

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    if (typeof json.rights === 'string') {
      json.rights = JSON.parse(json.rights);
    }

    return json;
  }
}
