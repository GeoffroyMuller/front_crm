import { ID } from 'core_api/types';
import {Model} from 'objection';

export default class Media extends Model {
    id?: ID;
    idCompany?: number;
    filepath?: string;
    filename?: string;


    static get tableName() {
        return 'medias'
    }

    static relationMappings = {
    };
}