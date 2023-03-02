
import controllerFactory from "core_api/controller";
import roleService from "./role.service";

const roleController = controllerFactory(roleService);

export default roleController;
