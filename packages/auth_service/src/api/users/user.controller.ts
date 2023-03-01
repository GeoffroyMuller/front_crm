import controllerFactory from "core_api/controller";
import userService from "./user.service";

const userController = controllerFactory(userService);

export default userController;