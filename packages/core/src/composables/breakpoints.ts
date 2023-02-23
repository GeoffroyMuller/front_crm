import type { $breakpoints } from "../plugins/breakpoints";
import { inject } from "vue";

export default function useBreakpoints() {
  return inject("breakpoints") as $breakpoints;
}
