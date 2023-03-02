
import controllerFactory from "core_api/controller";
import reservationService from "./reservation.service";

const reservationController = controllerFactory(reservationService);

export default reservationController;
