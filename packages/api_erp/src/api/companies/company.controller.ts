import controllerFactory from "core_api/controller";
import CompanyService from "./company.service";

const companyController = controllerFactory(CompanyService);

export default companyController;