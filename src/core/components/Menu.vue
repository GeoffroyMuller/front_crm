<template>
  <div
    v-click-outside="onClickOutside"
    :class="!needClickToSwitchOpen ? 'hover-menu' : ''"
    class="menu"
  >
    <div class="activator" @click="onClickActivator" ref="activator">
      <slot name="activator" :open="open" />
    </div>
    <Card
      class="content"
      :class="{
        left: displayLeft,
        top: displayTop,
      }"
      :style="style"
      @click="handleClickContent()"
    >
      <div ref="content" :style="{ width: 'fit-content' }">
        <slot />
      </div>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import Card from "./Card.vue";

const content = ref();
const activator = ref();

interface MenuProps {
  needClickToSwitchOpen?: boolean;
  closeOnSecondClick?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  needClickToSwitchOpen: true,
  closeOnSecondClick: true,
});

const style = computed(() => {
  const style: any = {
    display: open.value ? "block" : "none",
  };

  if (displayLeft.value) {
    style["margin-left"] = `${activatorDimensions.value.width}px`;
  }

  return style;
});

function onClickActivator() {
  if (!props.closeOnSecondClick) {
    open.value = true;
  } else {
    open.value = !open.value;
    if (!open.value) {
      emit("close");
    }
  }
}

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
const activatorDimensions = ref({
  width: 0,
  height: 0,
});

watch(
  () => open.value,
  () => {
    nextTick(() => {
      if (content.value != null) {
        const contentBoundingClientRect = content.value.getBoundingClientRect();

        const contentDimensions = {
          width: content.value.offsetWidth,
          left: contentBoundingClientRect.left,
          height: content.value.offsetHeight,
          top: contentBoundingClientRect.top,
        };

        activatorDimensions.value = {
          width: activator.value.offsetWidth,
          height: activator.value.offsetHeight,
        };

        const pageHeight = window.innerHeight;
        const pageWidth = window.innerWidth;

        if (contentDimensions.width + contentDimensions.left >= pageWidth) {
          displayLeft.value = true;
        } else {
          displayTop.value = false;
        }
        if (contentDimensions.height + top >= pageHeight) {
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
