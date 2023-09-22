import { isEqual } from "lodash";
import { nextTick, ref, watch, type Ref } from "vue";

export interface Tab {
  id: string;
  title: string;
}

export type UseTabsProps = {
  tabRef: Ref<HTMLElement>;
  tabs: Tab[];
};

export default function useTabs({ tabRef, tabs }: UseTabsProps) {
  const currentTab = ref();

  function handleClickTab(tab: Tab) {
    currentTab.value = tab.id;
    nextTick(() => {
      if (!tabRef.value) return;
      const selected = tabRef.value.querySelector(".selected");
      if (!selected) return;
      const selectedBounds = selected.getBoundingClientRect();
      const selectedLeft = selectedBounds.left;
      const tabsLeft = tabRef.value.getBoundingClientRect().left;
      if (tabsLeft && selectedLeft) {
        tabRef.value.style.setProperty(
          "--tab-indicator-left",
          `${selectedLeft - tabsLeft}px`
        );
        tabRef.value.style.setProperty(
          "--tab-indicator-width",
          `${selectedBounds.width}px`
        );
      }
    });
  }

  watch(
    () => tabs,
    (val, oldVal) => {
      if (!isEqual(val, oldVal)) {
        handleClickTab(val?.[0]);
      }
    },
    { immediate: true }
  );

  return {
    handleClickTab,
    currentTab,
  };
}
