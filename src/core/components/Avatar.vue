<template>
  <div
    class="avatar"
    :class="[color ? `avatar-${color}` : '', size ? `avatar-${size}` : '']"
  >
    <Icon class="icon" v-if="icon" :name="icon" />
    <img
      v-else-if="imgSrc"
      :src="imgSrc"
      :alt="imgAlt ? imgAlt : 'avatar'"
      :class="[size ? `avatar-${size}` : '']"
    />
    <span class="text" v-else>
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
}
const props = withDefaults(defineProps<AvatarProps>(), {
  size: "md",
});
</script>

<style lang="scss" scoped>
.avatar {
  overflow: hidden;
  border-radius: 50%;
  color: black;
  background-color: gray;
  font-size: 16px;
  font-weight: bold;
  @include flex(row, center, center);
  & .text {
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
  height: 34px;
  width: 34px;
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

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .avatar-#{$key} {
      background-color: color($key, 500);
      color: white;
    }
  } @else {
    .avatar-#{$key} {
      background-color: $value;
      color: white;
    }
  }
}
</style>
