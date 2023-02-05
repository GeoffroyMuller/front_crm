<template>
  <component :is="component" class="media" v-if="displayed">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Breakpoints } from "./components/types";
import useBreakpoints from "./helpers/vue/composables/breakpoints";

export interface MediaProps<T = any> {
  component?: "div" | "span";
  up?: Breakpoints;
  down?: Breakpoints;
}

const props = withDefaults(defineProps<MediaProps>(), {
  component: "div",
});

const b = useBreakpoints();

const displayed = computed(() => {
  const upOk = props.up ? b.up.value[props.up] : true;
  const downOk = props.down ? b.down.value[props.down] : true;
  return upOk && downOk;
});
</script>

<style lang="scss" scoped>
.media {
  width: 100%;
}
</style>
