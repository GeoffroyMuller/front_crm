<template>
  <Teleport to="body">
    <div
      class="sidebar"
      :class="{
        'sidebar-open': open,
        left: position === 'left',
      }"
      v-click-outside="onClickOutside"
    >
      <div class="sidebar-wrapper">
        <IconButton
          @click="onClickOutside"
          v-if="displayCloseBtn && open"
          name="close"
          class="close-button"
          size="xl"
        />
        <div class="content">
          <div :class="{ padding }">
            <div v-if="title" class="typo-title">
              {{ title }}
            </div>
            <slot />
          </div>
          <slot name="no-padding" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import IconButton from "./IconButton.vue";

interface SidebarProps {
  open: boolean;
  displayCloseBtn?: boolean;
  title?: string;
  padding?: boolean;
  position?: "left" | "right";
}
const props = withDefaults(defineProps<SidebarProps>(), {
  displayCloseBtn: true,
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
        padding: spacing(3.5) spacing(2);
      }
      .typo-title {
        margin-bottom: spacing(3);
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
  border: color("zinc", 100) 0px solid;
  background-color: color("white");
  > * {
    height: 100%;
    height: 100vh;
    min-width: $sidebar-width;
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: spacing(2);
    opacity: 0;
    transition: opacity 0.4s linear;
  }
  &.sidebar-open {
    border-width: 1px;
    max-width: 100%;
    .close-button {
      opacity: 1;
    }
  }
  .typo-title {
    margin-bottom: spacing(2);
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
