import controllerFactory from "core_api/controller";
import productRealService from "./product_real.service";

const productRealController = controllerFactory(productRealService);

export default productRealController;