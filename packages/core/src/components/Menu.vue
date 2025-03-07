<template>
  <div
    ref="activator"
    @click.stop="handleClickActivator"
    v-click-outside="handleClickOutside"
    :class="$props.class"
  >
    <slot name="activator" />
    <div ref="content" v-if="strategy !== 'root'">
      <Card :class="contentCardClass" bordered v-bind="cardProps">
        <slot name="content" />
      </Card>
    </div>
  </div>
  <Teleport v-if="strategy === 'root'" to="body">
    <div ref="content">
      <Card :class="contentCardClass" bordered v-bind="cardProps">
        <slot name="content" />
      </Card>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, Teleport, watch } from "vue";
import useMenu, { type MenuProps as UseMenuProps } from "../composables/menu";
import Card, { type CardProps } from "./card/Card.vue";

export interface MenuProps {
  placement?: UseMenuProps["placement"];
  alignment?: UseMenuProps["alignment"];
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
  alignment: props.alignment || "center",
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
  width: var(--menu-arrow-container-size, 10px);
  pointer-events: none;
  height: var(--menu-arrow-container-size, 10px);
  //filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5)); //TODO
  .menu-arrow {
    @apply bg-tooltip;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    width: 100%;
    height: 8px;
  }
}

.menu {
  position: relative;
  .menu-content {
    z-index: 4;
    position: absolute;
    //display: none;
    visibility: hidden;
  }
  &.menu-openhover:hover,
  &.open {
    .menu-content {
      //display: initial;
      visibility: visible;
    }
  }
}
</style>
