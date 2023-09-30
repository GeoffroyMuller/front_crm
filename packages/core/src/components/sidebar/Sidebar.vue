<template>
  <Teleport to="body">
    <div
      class="sidebar"
      :class="{
        'max-w-full md:max-w-[90%]': open,
        'max-w-0': !open,
        left: position === 'left',
      }"
      v-click-outside="onClickOutside"
    >
      <div class="overflow-y-auto h-full">
        <div class="h-full" :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { provide } from "vue";
import type { SidebarInject } from "./sidebar.types";

interface SidebarProps {
  open: boolean;
  displayCloseBtn?: boolean;
  title?: string;
  padding?: boolean;
  position?: "left" | "right";
  contentClass?: any;
}
const props = withDefaults(defineProps<SidebarProps>(), {
  position: "right",
});
const emit = defineEmits(["update:open"]);

function onClickOutside(event: PointerEvent) {
  // click on body just if click started on sidebar and finish outside
  // @ts-ignore
  if (event.target.tagName.toLocaleLowerCase() === "body") {
    return;
  }
  if (props.open) {
    emit("update:open", false);
  }
}

provide<SidebarInject>("sidebar", {
  open: props.open,
  close: () => emit("update:open", false),
});
</script>

<style lang="scss">
.sidebar {
  @apply z-sidebar shadow-sidebar fixed top-0 bottom-0 h-screen overflow-hidden w-fit bg-white max-md:p-0 max-md:m-0 md:top-headerHeight md:h-screenMinusHeaderHeight;

  &.left {
    left: 0;
  }
  &:not(.left) {
    right: 0;
  }
  transition: max-width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  > * {
    @apply h-screen relative min-w-[650px] max-md:min-w-0 max-md:w-screen max-md:p-0 max-md:m-0 md:h-screenMinusHeaderHeight;
  }
}
</style>
