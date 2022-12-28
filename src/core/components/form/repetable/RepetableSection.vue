<template>
  <div class="repetable-section">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _CustomInput } from "@/core/helpers/vue/composables/form";
import type { ISection } from "./Repetable.vue";
import useForm from "@/core/helpers/vue/composables/form";

interface RepetableSectionProps {
  value: ISection;
}

const props = withDefaults(defineProps<RepetableSectionProps>(), {});
const emit = defineEmits(["inputChange"]);

useForm({
  modelValue: props.value,
});
</script>

<style lang="scss">
.repetable-section {
  background-color: #fafafa;
}
</style>
