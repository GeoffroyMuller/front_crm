import controllerFactory from "core_api/controller";
import eventService from "./event.service";

const eventController = controllerFactory(eventService);

export default eventController;