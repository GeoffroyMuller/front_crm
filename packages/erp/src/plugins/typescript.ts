import type { CanFunction } from "./can";

declare module "vue" {
  interface ComponentCustomProperties {
    $can: CanFunction;
  }
}
