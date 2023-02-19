<template>
  <div
    ref="activator"
    @click.stop="handleClickActivator"
    v-click-outside="handleClickOutside"
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
import { ref, Teleport, watch } from "vue";
import useMenu from "../helpers/vue/composables/menu";
import Card from "./Card.vue";

interface MenuProps {
  placement?: "top" | "bottom" | "left" | "right";
  gap?: number;
  class?: any;
  disabled?: boolean;
  open?: boolean;
  stopOpenOnClickActivator?: boolean;
}
const props = withDefaults(defineProps<MenuProps>(), {});
const emit = defineEmits(["update:open"]);

const activator = ref();
const content = ref();

const { open } = useMenu({
  activator,
  container: content,
  openOnHover: false,
  placement: props.placement || "bottom",
  gap: props.gap || 0,
});

watch(
  () => props.open,
  (value) => {
    open.value = value;
  }
);

function handleClickActivator() {
  if (props.disabled || props.stopOpenOnClickActivator) return;
  open.value = !open.value;
  emit("update:open", open.value);
}

function handleClickOutside() {
  open.value = false;
  emit("update:open", false);
}
</script>
