import { ID } from 'core_api/types';
import { Media as M } from 'grpcservice/types/media/media';
import {Model} from 'objection';

export default class Media extends Model implements Partial<M> {
    id?: number;
    idCompany?: number;
    filepath?: string;
    filename?: string;
    id_model?: number;
    model?: string;

    static get tableName() {
        return 'medias'
    }

    static relationMappings = {
    };
}