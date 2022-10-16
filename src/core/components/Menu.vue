<template>
  <div :class="!needClickToSwitchOpen ? 'hover-menu' : ''" class="menu" @click.stop>
    <div class="activator" @click="open = !open">
      <slot name="activator" :open="open" />
    </div>
    <Card
      class="content"
      :style="{ display: open ? 'block' : 'none' }"
      @click="handleClickContent()"
    >
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
  needClickToSwitchOpen: true,
});

const open = ref(false);

const emit = defineEmits(["close"]);

useEventListener(document.body, "click", () => {
  if (open.value) {
    open.value = false;
    emit("close");
  }
});

function handleClickContent() {
  open.value = false;
  emit("close");
}
</script>

<style scoped lang="scss">
.menu {
  position: relative;
  .content {
    display: none;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    z-index: 5;
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
