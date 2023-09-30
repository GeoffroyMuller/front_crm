import type { Tab } from "src/composables/tabs";

export type SidebarInject = {
  open: boolean;
  close: () => void;
  setCurrentTab: (currentTab: Tab["id"]) => void;
};
