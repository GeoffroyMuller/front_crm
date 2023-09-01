<template>
  <div class="repetable-section">
    <div
      v-if="!isMin"
      class="w-full flex col-span-2"
      :class="{ 'justify-end': !orderable, 'justify-between': orderable }"
    >
      <div v-if="orderable" class="drag_handle">
        <Icon name="drag_indicator"></Icon>
      </div>
      <IconButton
        class="justify-self-end"
        name="delete"
        color="danger"
        v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
        @click.stop="emit('unregister')"
      />
    </div>
    <div class="repetable-section-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "../../IconButton.vue";
import type { _CustomInput } from "../../../composables/form";
import useForm from "../../../composables/form";
import Icon from "../../Icon.vue";
import { onMounted, onUnmounted, toRef } from "vue";

interface RepetableSectionProps {
  value: any;
  orderable?: boolean;
  isMin: boolean;
}

const props = withDefaults(defineProps<RepetableSectionProps>(), {});
const emit = defineEmits(["inputChange", "register", "unregister"]);

const { validate, errors } = useForm({
  initialValue: toRef(props, "value"),
  onInputChange(val) {
    emit("inputChange", val);
  },
});

onMounted(() => {
  emit("register", {
    validate,
    errors,
  });
});

onUnmounted(() => {
  emit("unregister");
});
</script>

<style lang="scss">
.repetable-section {
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  .drag_handle {
    cursor: grab;
    margin-left: spacing(-1);
  }
  .repetable-section-content {
    flex-grow: 1;
  }
}
.repetable-section-ghost {
  > * {
    opacity: 0;
  }
  background-color: transparent;
  border: 1px dashed #ccc;
}
.repetable-section-cloned-element {
  opacity: 1 !important;
}
</style>
