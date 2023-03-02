import { Model } from "objection"

export default class Company extends Model {
    id?: number;
    name?: string;
    idCompany?: number;

    static get tableName() {
        return 'companies'
    }

    static relationMappings = {
    };
}

