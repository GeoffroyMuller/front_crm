import type { $breakpoints } from "core/src/plugins/breakpoints";
import { inject } from "vue";

export default function useBreakpoints() {
  return inject("breakpoints") as $breakpoints;
}
