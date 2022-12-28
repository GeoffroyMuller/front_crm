<template>
  <Teleport to="body">
    <div
      class="sidebar"
      :class="{
        'sidebar-open': open,
      }"
      v-click-outside="onClickOutside"
    >
      <div>
        <IconButton
          @click="onClickOutside"
          v-if="displayCloseBtn && open"
          name="close"
          class="close-button"
          size="xl"
        />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import IconButton from "@/core/components/IconButton.vue";

interface SidebarProps {
  open: boolean;
  displayCloseBtn?: boolean;
}
const props = withDefaults(defineProps<SidebarProps>(), {
  displayCloseBtn: true,
});
const emit = defineEmits(["update:open"]);

function onClickOutside() {
  if (props.open) {
    emit("update:open", false);
  }
}
</script>

<style lang="scss">
.sidebar {
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
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%);
  border: #ebebeb 1px solid;
  background-color: white;
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
    padding: spacing(1);
    opacity: 0;
    transition: opacity 0.4s linear;
  }
  &.sidebar-open {
    max-width: 100%;
    .close-button {
      opacity: 1;
    }
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
