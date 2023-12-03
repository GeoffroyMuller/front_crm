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
  tabs: Ref<Tab[]>;
  defaultTab?: Tab["id"];
};

export default function useTabs(props: UseTabsProps) {
  const currentTab = ref<Tab["id"]>();

  const nbTabsHidden = ref(0);

  function computeTabOverflow() {
    if (!props.tabRef.value) return;
    if (props.tabs.value.length <= 2) return;
    nbTabsHidden.value = 0;
    nextTick(() => {
      const visibleWidth = props.tabRef.value.offsetWidth;
      const totalWidth = props.tabRef.value.scrollWidth;
      if (visibleWidth < totalWidth) {
        const tabsLeft = props.tabRef.value.getBoundingClientRect().left;
        const childrenDisplayed = Array.from(
          props.tabRef.value.children
        ).filter((elem) => {
          const elemRight = elem.getBoundingClientRect().right - tabsLeft;
          if (elemRight >= visibleWidth) {
            return true;
          }
          return false;
        });
        nbTabsHidden.value = childrenDisplayed.length
          ? childrenDisplayed.length + 1
          : 0;
      }
    });
  }

  function computeTabSelectedIndicator() {
    if (!props.tabRef.value) return;
    const tabsLeft = props.tabRef.value.getBoundingClientRect().left;
    if (tabsHidden.value.find((t) => t.id == currentTab.value)) {
      props.tabRef.value.style.setProperty(
        "--tab-indicator-left",
        `${
          (props.tabRef.value.lastElementChild?.getBoundingClientRect()?.left ||
            tabsLeft) - tabsLeft
        }px`
      );
      props.tabRef.value.style.setProperty(
        "--tab-indicator-width",
        `${
          props.tabRef.value.lastElementChild?.getBoundingClientRect()?.width
        }px`
      );
      return;
    }
    const selected = props.tabRef.value.querySelector(".selected");
    if (!selected) return;
    const selectedBounds = selected.getBoundingClientRect();
    const selectedLeft = selectedBounds.left;
    if (tabsLeft && selectedLeft) {
      props.tabRef.value.style.setProperty(
        "--tab-indicator-left",
        `${selectedLeft - tabsLeft}px`
      );
      props.tabRef.value.style.setProperty(
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
    return props.tabs.value.slice(props.tabs.value.length - nbTabsHidden.value);
  });

  const tabsVisible = computed(() => {
    if (nbTabsHidden.value === 0) return props.tabs.value;
    return props.tabs.value.slice(0, props.tabs.value.length - nbTabsHidden.value);
  });

  watch(
    () => tabsHidden.value,
    () => {
      nextTick(computeTabSelectedIndicator);
    }
  );

  watch(
    () => props.tabs.value,
    (val, oldVal) => {
      if (!isEqual(val, oldVal)) {
        handleClickTab(props.defaultTab || val?.[0].id);
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
