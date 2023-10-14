<template>
  <div
    class="avatar notranslate"
    :class="[color ? `bg-${color}-500` : '', size ? `avatar-${size}` : '', {
      'selectable': selectable,
    }]"
  >
    <Icon class="icon" v-if="icon" :name="icon" />
    <img
      v-else-if="imgSrc"
      :src="imgSrc"
      :alt="imgAlt ? imgAlt : 'avatar'"
      :class="[size ? `avatar-${size}` : '']"
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

interface AvatarProps {
  color?: Color;
  size?: Size;

  text?: string;

  icon?: IconName;

  imgSrc?: string;
  imgAlt?: string;

  selectable?: boolean;
}
const props = withDefaults(defineProps<AvatarProps>(), {
  size: "md",
});
</script>

<style lang="scss" scoped>
.avatar {
  overflow: hidden;
  border-radius: 50%;
  font-weight: bold;
  @apply flex justify-center items-center select-none;
  color: white;

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
  & .txt {
    padding-left: 1px;
    padding-top: 1px;
  }
  & .icon {
    padding-left: 1px;
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
