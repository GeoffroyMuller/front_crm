<template>
  <div
    ref="activator"
    @click.stop="handleClickActivator"
    v-click-outside="() => (open = false)"
    :class="$props.class"
  >
    <slot name="activator" />
  </div>
  <Teleport to="body">
    <div ref="content">
      <Card :withPadding="false">
        <slot name="content" />
      </Card>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useMenu from "../helpers/vue/composables/menu";
import Card from "./Card.vue";

interface MenuProps {
  placement?: "top" | "bottom" | "left" | "right";
  gap?: number;
  class?: any;
  disabled?: boolean;
}
const props = withDefaults(defineProps<MenuProps>(), {});

const activator = ref();
const content = ref();

const { open } = useMenu({
  activator,
  container: content,
  openOnHover: false,
  placement: props.placement || "bottom",
  gap: props.gap || 0,
});

function handleClickActivator() {
  if (props.disabled) return;
  open.value = !open.value;
}
</script>
