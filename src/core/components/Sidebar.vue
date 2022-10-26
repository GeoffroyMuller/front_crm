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
        <slot />
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
interface SidebarProps {
  open: boolean;
}
const props = withDefaults(defineProps<SidebarProps>(), {});
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
  }
  &.sidebar-open {
    max-width: 100%;
  }
}
</style>
