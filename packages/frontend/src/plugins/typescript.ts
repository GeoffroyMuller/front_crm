import type { CanFunction } from "./can";
import type { HasModuleFunction } from "./hasModule";

declare module "vue" {
  interface ComponentCustomProperties {
    // plugin to check if user can perform an action (has specific permission)
    $can: CanFunction;
    // plugin to check if a specific module is in the current app
    $hasModule: HasModuleFunction;
  }
}
