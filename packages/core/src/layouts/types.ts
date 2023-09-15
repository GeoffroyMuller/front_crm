import type { IconName } from "src/components/types";
import type { Ref } from "vue";
import type { RouteRecordRaw } from "vue-router";

export type LayoutSideMenuProvide = {
  isNavMini: Ref<boolean>;
  toggleNavMini: () => void;
};

export type MenuItem = {
  key: string;
  path: string | { name: string };
  title: string;
  icon: IconName;
  children?: MenuItem[];
};
