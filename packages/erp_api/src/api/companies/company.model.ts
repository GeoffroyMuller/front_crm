import { Model } from "objection"
import Vat from "../vats/vat.model";

export default class Company extends Model {

    id?: number;
    name?: string;
    idCompany?: number;

    static get tableName() {
        return 'clients_companies'
    }

    static relationMappings = {
        vat: {
            relation: Model.HasManyRelation,
            modelClass: Vat,
            join: {
                from: 'companies.id',
                to: 'vat.idCompany'
            }
        },
    };
}

