<template>
  <div class="repetable-section">
    <div v-if="orderable" class="drag_handle">
      <Icon name="drag_handle"></Icon>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _CustomInput } from "../../../composables/form";
import type { ISection } from "./Repetable.vue";
import useForm from "../../../composables/form";
import Icon from "../../Icon.vue";
import { onMounted, onUnmounted, toRef } from "vue";

interface RepetableSectionProps {
  value: ISection;
  orderable?: boolean;
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
  background-color: color("zinc", 50);
  display: flex;
  align-items: center;
  gap: spacing(2);
  > *:last-child {
    flex-grow: 1;
  }
  .drag_handle {
    cursor: grab;
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
