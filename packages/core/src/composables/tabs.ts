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
  defaultTab?: Tab["id"];
};

export default function useTabs({ tabRef, tabs, defaultTab }: UseTabsProps) {
  const currentTab = ref<Tab["id"]>();

  const nbTabsHidden = ref(0);

  function computeTabOverflow() {
    if (!tabRef.value) return;
    if (tabs.length <= 2) return;
    nbTabsHidden.value = 0;
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

  function computeTabSelectedIndicator() {
    if (!tabRef.value) return;
    const tabsLeft = tabRef.value.getBoundingClientRect().left;
    if (tabsHidden.value.find((t) => t.id == currentTab.value)) {
      tabRef.value.style.setProperty(
        "--tab-indicator-left",
        `${
          (tabRef.value.lastElementChild?.getBoundingClientRect()?.left ||
            tabsLeft) - tabsLeft
        }px`
      );
      tabRef.value.style.setProperty(
        "--tab-indicator-width",
        `${tabRef.value.lastElementChild?.getBoundingClientRect()?.width}px`
      );
      return;
    }
    const selected = tabRef.value.querySelector(".selected");
    if (!selected) return;
    const selectedBounds = selected.getBoundingClientRect();
    const selectedLeft = selectedBounds.left;
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
  }

  onMounted(() => {
    computeTabOverflow();
    window.addEventListener("resize", computeTabOverflow);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", computeTabOverflow);
  });

  function handleClickTab(tabid: Tab["id"]) {
    currentTab.value = tabid;
    nextTick(computeTabSelectedIndicator);
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
    () => tabsHidden.value,
    () => {
      nextTick(computeTabSelectedIndicator);
    }
  );

  watch(
    () => tabs,
    (val, oldVal) => {
      if (!isEqual(val, oldVal)) {
        handleClickTab(defaultTab || val?.[0].id);
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
