import type { IconName } from "src/components/types";
import type { Ref } from "vue";

export type LayoutSideMenuProvide = {
  isNavMini: Ref<boolean>;
};

export type MenuItem = {
  key: string;
  path: string;
  title: string;
  icon: IconName;
  children?: MenuItem[];
};
