import controllerFactory from "core_api/controller";
import productService from "./product.service";

const productController = controllerFactory(productService);

export default productController;