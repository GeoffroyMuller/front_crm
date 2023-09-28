import { isEqual } from "lodash";
import {
  nextTick,
  ref,
  watch,
  type Ref,
  onMounted,
  computed,
  onUnmounted,
} from "vue";

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

  const nbTabsHidden = ref(0);

  function computeTabOverflow() {
    if (!tabRef.value) return;
    nbTabsHidden.value = 0;
    if (tabs.length <= 2) return;
    nextTick(() => {
      const visibleWidth = tabRef.value.offsetWidth;
      const totalWidth = tabRef.value.scrollWidth;
      if (visibleWidth < totalWidth) {
        const tabsLeft = tabRef.value.getBoundingClientRect().left;
        const childrenDisplayed = Array.from(tabRef.value.children).filter(
          (elem) => {
            const elemRight = elem.getBoundingClientRect().right - tabsLeft;
            if (elemRight >= visibleWidth) {
              return true;
            }
            return false;
          }
        );
        nbTabsHidden.value = childrenDisplayed.length
          ? childrenDisplayed.length + 1
          : 0;
      }
    });
  }

  onMounted(() => {
    computeTabOverflow();
    window.addEventListener("resize", computeTabOverflow);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", computeTabOverflow);
  });

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

  const tabsHidden = computed(() => {
    if (nbTabsHidden.value === 0) return [];
    return tabs.slice(tabs.length - nbTabsHidden.value);
  });

  const tabsVisible = computed(() => {
    if (nbTabsHidden.value === 0) return tabs;
    return tabs.slice(0, tabs.length - nbTabsHidden.value);
  });

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
    nbTabsHidden,
    tabsHidden,
    tabsVisible,
  };
}
