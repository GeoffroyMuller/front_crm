<template>
  <div :class="!needClickToSwitchOpen ? 'hover-menu' : ''" class="menu" @click.stop>
    <div
      class="activator"
      @click="open = !open"
      ref="activator"
      v-click-outside="onClickOutside"
    >
      <slot name="activator" :open="open" />
    </div>
    <Card
      class="content"
      :class="{
        left: displayLeft,
        top: displayTop,
      }"
      :style="{ display: open ? 'block' : 'none' }"
      @click="handleClickContent()"
    >
      <div ref="content" :style="{ width: 'fit-content' }">
        <slot />
      </div>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import useEventListener from "../helpers/vue/composables/eventListener";
import Card from "./Card.vue";

const content = ref();
const activator = ref();

interface MenuProps {
  needClickToSwitchOpen?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  needClickToSwitchOpen: true,
});

onMounted(() => {});

const open = ref(false);

const emit = defineEmits(["close"]);

function onClickOutside() {
  if (open.value) {
    open.value = false;
    emit("close");
  }
}

function handleClickContent() {
  open.value = false;
  emit("close");
}

const displayTop = ref(false);
const displayLeft = ref(false);

watch(
  () => open.value,
  () => {
    nextTick(() => {
      if (content.value != null) {
        const boundingClientRect = content.value.getBoundingClientRect();

        const width = content.value.offsetWidth;
        const left = boundingClientRect.left;
        const height = content.value.offsetHeight;
        const top = boundingClientRect.top;
        const pageHeight = window.innerHeight;
        const pageWidth = window.innerWidth;

        if (width + left >= pageWidth) {
          displayLeft.value = true;
        } else {
          displayTop.value = false;
        }
        if (height + top >= pageHeight) {
          displayTop.value = true;
        } else {
          displayTop.value = false;
        }
      }
    });
  }
);
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
    &.left {
      transform: translateY(100%) translateX(-100%);
    }
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
