import { Model } from "objection";
import SaleLine from "./sale_line.model";
import ReservationSubline from "./reservation_subline.model";

export default class ReservationLine extends SaleLine<ReservationSubline> {
  idReservation?: number;

  static get tableName() {
    return "reservation_lines";
  }

    static get relationMappings() {
    const ReservationSublineModel = require("./reservation_subline.model").default;
    return {
      sublines: {
        relation: Model.HasManyRelation,
        modelClass: ReservationSublineModel,
        join: {
          from: ReservationLine.tableName + ".id",
          to: "reservation_sublines.idLine",
        },
      },
    };
  }
}
