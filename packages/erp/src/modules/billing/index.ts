import type { AppModule } from "core/src/types";
import routes from "./routes";

const BillingModule: AppModule = {
  name: "billing",
  routes,
};

export default BillingModule;
