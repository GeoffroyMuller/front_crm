<template>
  <Teleport to="body">
    <div
      class="sidebar"
      :class="{
        'sidebar-open': open,
      }"
      @click.stop
    >
      <Card>
        <slot />
      </Card>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import useEventListener from "../helpers/vue/composables/eventListener";
import Card from "./Card.vue";

interface SidebarProps {
  open: boolean;
}
const props = withDefaults(defineProps<SidebarProps>(), {});
const emit = defineEmits(["update:open"]);

useEventListener(document.body, "click", () => {
  if (props.open) {
    emit("update:open", !props.open);
  }
});
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
  transition: max-width 0.3s ease;
  z-index: 5;
  width: fit-content;
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
