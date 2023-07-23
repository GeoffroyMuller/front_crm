<template>
  <div
    ref="activator"
    @click.stop="handleClickActivator"
    v-click-outside="handleClickOutside"
    :class="$props.class"
  >
    <slot name="activator" />
    <div ref="content" v-if="strategy !== 'root'">
      <Card :withPadding="false" :class="contentCardClass" v-bind="cardProps">
        <slot name="content" />
      </Card>
    </div>
  </div>
  <Teleport v-if="strategy === 'root'" to="body">
    <div ref="content">
      <Card :class="contentCardClass" v-bind="cardProps">
        <slot name="content" />
      </Card>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, Teleport, watch } from "vue";
import useMenu, { type MenuProps as UseMenuProps } from "../composables/menu";
import Card, { type CardProps } from "./card/Card.vue";

interface MenuProps {
  placement?: UseMenuProps["placement"];
  gap?: number;
  class?: any;
  disabled?: boolean;
  open?: boolean;
  stopOpenOnClickActivator?: boolean;
  fullActivatorWidth?: boolean;
  contentCardClass?: any;
  openOnHover?: boolean;
  strategy?: UseMenuProps["strategy"];
  cardProps?: Partial<CardProps>;
}
const props = withDefaults(defineProps<MenuProps>(), {
  contentCardClass: "",
  openOnHover: false,
  strategy: "absolute",
});
const emit = defineEmits(["update:open"]);

const activator = ref();
const content = ref();

const { open } = useMenu({
  activator,
  container: content,
  openOnHover: props.openOnHover,
  placement: props.placement || "bottom",
  gap: props.gap || 0,
  fullActivatorWidth: props.fullActivatorWidth,
  strategy: props.strategy,
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

<style lang="scss">

.menu-arrow-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 10px;
  height: 10px;
  .menu-arrow {
    background-color: red;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    width: 10px;
    height: 8px;
  }
}

.menu {
  position: relative;
  .menu-content {
    z-index: 4;
    position: absolute;
    display: none;
  }
  &.menu-openhover:hover,
  &.open {
    .menu-content {
      display: initial;
    }
  }
}
</style>
