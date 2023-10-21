import { User } from "core_api/types";
import { RelationExpression } from "objection";
import Tasks from "./task.model";

export default { 
    paginate: async (
        relations: RelationExpression<Tasks>[],
        filters: any,
        auth: User
      )  => {
        
      }
}