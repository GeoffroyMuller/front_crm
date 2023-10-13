import type { Tab } from "src/composables/tabs";

export type SidebarInject = {
  open: boolean;
  close: () => void;
  setCurrentTab: (currentTab: Tab["id"]) => void;
};

export const SIDEBAR_ANIMATION_DURATION = 500;
