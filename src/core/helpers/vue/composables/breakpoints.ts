import type { $breakpoints } from "@/core/plugins/breakpoints";
import { inject } from "vue";

export default function useBreakpoints() {
  return inject("breakpoints") as $breakpoints;
}
