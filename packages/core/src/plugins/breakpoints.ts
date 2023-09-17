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

// TODO: get breakpoints tailwindcss
export const gridBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const current = ref<Breakpoints>("xs");

const computedCurrentBreakpoint = () => {
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
};

const breakpointsPlugin: Plugin = {
  install(app) {
    computedCurrentBreakpoint();
    window.addEventListener("resize", computedCurrentBreakpoint);

    function _getIndex(key: string) {
      return Object.keys(gridBreakpoints).indexOf(key);
    }

    const up = computed(() => {
      return Object.keys(gridBreakpoints).reduce(
        (acc: UpDownBreakpoints, key: string) => {
          return {
            ...acc,
            [key]: _getIndex(current.value) >= _getIndex(key),
          };
        },
        {}
      );
    });

    const down = computed(() => {
      return Object.keys(gridBreakpoints).reduce(
        (acc: UpDownBreakpoints, key: string, index: number) => {
          if (index == 0) {
            return {
              ...acc,
              [key]: _getIndex(current.value) == _getIndex(key),
            };
          }
          return {
            ...acc,
            [key]: _getIndex(current.value) < _getIndex(key),
          };
        },
        {}
      );
    });

    const opt = {
      current,
      up,
      down,
    };

    // @ts-ignore
    app.config.globalProperties.$breakpoints = opt;

    app.provide("breakpoints", opt);
  },
};

export default breakpointsPlugin;
