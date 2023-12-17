<template>
  <div
    class="avatar notranslate"
    :class="[
      color && !customColor ? `bg-${color}-500` : '',
      size ? `avatar-${size}` : '',
      {
        selectable: selectable,
        'text-white': color,
      },
    ]"
    :style="style"
    ref="avatarRef"
    :tabindex="selectable ? 0 : -1"
    @keydown.enter="
      // @ts-ignore
      selectable && $refs?.avatarRef?.click()
    "
  >
    <Icon class="icon" v-if="icon" :name="icon" />
    <img
      v-else-if="imgSrc && !loadImgError"
      :src="imgSrc"
      :alt="imgAlt ? imgAlt : 'avatar'"
      :class="[size ? `avatar-${size}` : '']"
      @error="loadImgError = true"
    />
    <span class="txt" v-else>
      {{ text }}
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Color, IconName, Size } from "./types";
import Icon from "./Icon.vue";
import { computed, ref } from "vue";

interface AvatarProps {
  color?: Color;
  size?: Size;

  text?: string;

  icon?: IconName;

  imgSrc?: string;
  imgAlt?: string;

  selectable?: boolean;
  customColor?: string;
}
const props = withDefaults(defineProps<AvatarProps>(), {
  size: "md",
});

const style = computed(() => {
  if (!props.customColor) return undefined;
  return {
    backgroundColor: props.customColor,
  };
});

const loadImgError = ref(false);
</script>

<style lang="scss" scoped>
.avatar {
  overflow: hidden;
  border-radius: 50%;
  font-weight: bold;
  @apply flex justify-center items-center select-none shadow-avatar;

  &.selectable {
    cursor: pointer;
    position: relative;

    &:hover {
      &::before {
        content: " ";
        @apply absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-black opacity-10 rounded-full pointer-events-none;
      }
    }
  }

  & img {
    object-fit: cover;
  }
}

.avatar-sm {
  height: 30px;
  width: 30px;
  font-size: 14px;
}

.avatar-md {
  height: 40px;
  width: 40px;
}

.avatar-lg {
  height: 50px;
  width: 50px;
}

.avatar-xl {
  height: 120px;
  width: 120px;
}
</style>
