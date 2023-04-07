import { Model } from "objection";
import { ID } from "core_api/types";

export default class SaleSubline extends Model {
  id?: ID;
  idLine?: number;
  idProductReal?: number;
}
