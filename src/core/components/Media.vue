<template>
  <template v-if="displayed">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Breakpoints } from "./types";
import useBreakpoints from "../helpers/vue/composables/breakpoints";

export interface MediaProps<T = any> {
  up?: Breakpoints;
  down?: Breakpoints;
}

const props = withDefaults(defineProps<MediaProps>(), {});

const b = useBreakpoints();

const displayed = computed(() => {
  const upOk = props.up ? b.up.value[props.up] : true;
  const downOk = props.down ? b.down.value[props.down] : true;
  return upOk && downOk;
});
</script>
