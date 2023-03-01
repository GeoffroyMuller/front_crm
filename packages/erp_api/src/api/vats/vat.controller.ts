import controllerFactory from "core_api/controller";
import VatService from "./vat.service";

const vatController = controllerFactory(VatService);

export default vatController;