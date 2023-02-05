import { computed, ref, type ComputedRef, type Plugin } from "vue";
import type { Breakpoints } from "../components/types";

interface UpDownBreakpoints {
  [b: string]: boolean;
}

export interface $breakpoints {
  current: Breakpoints;
  up: ComputedRef<UpDownBreakpoints>;
  down: ComputedRef<UpDownBreakpoints>;
}

// TODO: get breakpoints from css
//$grid-breakpoints: (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px);
export const gridBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const breakpointsPlugin: Plugin = {
  install(app) {
    const current = ref<Breakpoints>("xs");

    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const currentBreakpoint = Object.entries(gridBreakpoints).reduce(
        (acc: any, [key, value]: any) => {
          if (width >= value) {
            return key as Breakpoints;
          }
          return acc;
        },
        "xs"
      );
      current.value = currentBreakpoint;
    });

    function _getIndex(key: string) {
      return Object.keys(gridBreakpoints).indexOf(key);
    }

    const up = computed(() => {
      return {
        xs: _getIndex(current.value) >= _getIndex("xs"),
        sm: _getIndex(current.value) >= _getIndex("sm"),
        md: _getIndex(current.value) >= _getIndex("md"),
        lg: _getIndex(current.value) >= _getIndex("lg"),
        xl: _getIndex(current.value) >= _getIndex("xl"),
      };
    });

    const down = computed(() => {
      return {
        xs: _getIndex(current.value) == _getIndex("xs"),
        sm: _getIndex(current.value) < _getIndex("sm"),
        md: _getIndex(current.value) < _getIndex("md"),
        lg: _getIndex(current.value) < _getIndex("lg"),
        xl: _getIndex(current.value) < _getIndex("xl"),
      };
    });

    const opt = {
      current,
      up,
      down,
    };

    app.config.globalProperties.$breakpoints = opt;

    app.provide("breakpoints", opt);
  },
};

export default breakpointsPlugin;
