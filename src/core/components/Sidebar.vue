<template>
  <Teleport to="body">
    <div
      class="sidebar"
      :class="{
        'sidebar-open': open,
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
        <div class="content" :class="{ padding }">
          <div v-if="title" class="title">
            {{ title }}
          </div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import IconButton from "@/core/components/IconButton.vue";

interface SidebarProps {
  open: boolean;
  displayCloseBtn?: boolean;
  title?: string;
  padding?: boolean;
}
const props = withDefaults(defineProps<SidebarProps>(), {
  displayCloseBtn: true,
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
      &.padding {
        padding: spacing(2);
      }
      .title {
        margin-bottom: spacing(3);
      }
    }
  }
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  max-width: 0;
  overflow: hidden;
  transition: max-width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 5;
  width: fit-content;
  box-shadow: 0 20px 25px -5px color("zinc", 100),
    0 8px 10px -6px color("zinc", 100);
  border: color("zinc", 100) 1px solid;
  background-color: color("white");
  > * {
    height: 100%;
    height: 100vh;
    min-width: 500px;
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: spacing(0.5);
    opacity: 0;
    transition: opacity 0.4s linear;
  }
  &.sidebar-open {
    max-width: 100%;
    .close-button {
      opacity: 1;
    }
  }
  .title {
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
