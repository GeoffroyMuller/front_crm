<template>
  <div
    :class="!needClickToSwitchOpen ? 'hover-menu' : ''"
    class="menu"
    @click.stop
  >
    <div class="activator" @click="open = true">
      <slot name="activator" />
    </div>
    <Card class="content">
      <slot />
    </Card>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import useEventListener from "../helpers/vue/composables/eventListener";
import Card from "./Card.vue";

interface MenuProps {
  needClickToSwitchOpen?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  needClickToSwitchOpen: false,
});

const open = ref(false);

useEventListener(document.body, "click", () => {
  open.value = false;
});
</script>

<style scoped lang="scss">
.menu {
  position: relative;
  .content {
    display: none;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
  }
  .activator {
    cursor: pointer;
  }
}
.hover-menu {
  &:hover {
    .content {
      display: block;
    }
  }
}
</style>
