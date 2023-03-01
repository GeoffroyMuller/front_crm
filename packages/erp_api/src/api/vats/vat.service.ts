import serviceFactory from "core_api/service"
import User from "../users/user.model";
import Vat from "./vat.model"

const vatService = serviceFactory<Vat, User>(Vat, {

});

export default vatService;