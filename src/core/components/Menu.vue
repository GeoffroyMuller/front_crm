<template>
  <!-- <div v-click-outside="onClickOutside" class="menu">
      <div class="activator" @click="onClickActivator" ref="activator">
        <slot name="activator" :open="open" />
      </div>
      <div ref="content" class="content">
        <Card @click="handleClickContent()">
          <slot />
        </Card>
      </div>
    </div> -->
  <div></div>
</template>
<script setup lang="ts">
/* 
  import { ref, toRef } from "vue";
  import useMenu from "../helpers/vue/composables/menu";
  import Card from "./Card.vue";
  
  const content = ref();
  const activator = ref();
  
  interface MenuProps {
    needClickToSwitchOpen?: boolean;
    closeOnSecondClick?: boolean;
    disabled?: boolean;
  }
  
  const props = withDefaults(defineProps<MenuProps>(), {
    needClickToSwitchOpen: true,
    closeOnSecondClick: true,
  });
  
  const isDisabled = toRef(props, "disabled");
  
  const { open } = useMenu({
    activator: activator.value,
    content,
    openOnHover: !props.needClickToSwitchOpen,
    disabled: isDisabled,
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
  } */
</script>

<style scoped lang="scss">
.menu {
  position: relative;
  .content {
    display: none;
  }
  .activator {
    cursor: pointer;
  }
}
</style>
