import { Model } from "objection";
import ReservationLine from "./reservation_line.model";

export default class Reservation extends Model {
  id?: number;
  idCompany?: number;
  idClient?: number;
  customerName?: string;
  description?: string;
  dtstart?: string;
  dtend?: string;
  created_at?: string;

  lines?: Array<ReservationLine>;


  static get tableName() {
    return "reservations";
  }

  static get relationMappings() {
    const ReservationLineModel = require("./reservation_line.model").default;
    return {
      lines: {
        relation: Model.HasManyRelation,
        modelClass: ReservationLineModel,
        join: {
          from: Reservation.tableName + ".id",
          to: ReservationLineModel.tableName + ".idReservation",
        },
      },
    };
  }
}
