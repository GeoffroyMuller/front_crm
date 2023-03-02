import serviceFactory from "core_api/service"
import type { User } from "core_api/types";;
import Vat from "./vat.model"

const vatService = serviceFactory<Vat, User>(Vat, {

});

export default vatService;