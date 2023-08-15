<template>
  <Teleport to="body">
    <div
      class="sidebar shadow-sidebar"
      :class="{
        'sidebar-open': open,
        left: position === 'left',
      }"
      v-click-outside="onClickOutside"
    >
      <div class="sidebar-wrapper">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
interface SidebarProps {
  open: boolean;
  displayCloseBtn?: boolean;
  title?: string;
  padding?: boolean;
  position?: "left" | "right";
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
</script>

<style lang="scss">
.sidebar {
  .sidebar-wrapper {
    overflow-y: auto;
    .content {
      .padding {
        padding: 0 spacing(2);
      }
    }
  }
  position: fixed;
  &.left {
    left: 0;
  }
  &:not(.left) {
    right: 0;
  }
  top: 0;
  bottom: 0;
  height: 100vh;
  max-width: 0;
  overflow: hidden;
  transition: max-width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 26;
  width: fit-content;
  background-color: color("white");
  > * {
    height: 100%;
    height: 100vh;
    @include media-up(md) {
      height: calc(100vh - $layoutSideHeaderHeight);
    }

    min-width: $sidebar-width;
    position: relative;
  }
  &.sidebar-open {
    max-width: 100%;
    .close-button {
      opacity: 1;
    }
  }
  @include media-up(md) {
    height: calc(100vh - $layoutSideHeaderHeight);
    top: $layoutSideHeaderHeight;
  }
}

@include media-down(md) {
  .sidebar {
    padding: 0;
    margin: 0;
    > * {
      min-width: 0;
      width: 100vw;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
