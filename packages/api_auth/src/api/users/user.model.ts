import { Model, Pojo } from "objection";
import Company from "../companies/company.model";
import Role from "../roles/role.model";
import type { ID, User as UserType, Role as RoleType } from "core_api/types";

export default class User extends Model implements Partial<UserType> {
  id?: number;
  firstname?: string;
  lastname?: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
  idCompany?: number;
  idRole?: number;
  company?: Company;
  role?: RoleType;
  accessTokenCode?: string | null;
  refreshToken?: string | null;

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    delete json.password;
    delete json.accessTokenCode;
    delete json.refreshToken;
    return json;
  }

  static get tableName() {
    return "users";
  }

  static relationMappings = {
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: Company,
      join: {
        from: "users.idCompany",
        to: "companies.id",
      },
    },
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: "users.idRole",
        to: "roles.id",
      },
    },
  };
}
