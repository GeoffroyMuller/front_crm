import ClientService from "./client.service";
import controllerFactory from "core_api/controller";

const clientController = controllerFactory(ClientService);

export default clientController;