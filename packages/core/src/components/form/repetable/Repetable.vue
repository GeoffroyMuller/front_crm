<template>
  <div class="repetable-wrapper">
    <label class="repetable-label" v-if="label">
      {{ label }}
    </label>

    <draggable
      v-if="orderable"
      v-model="sections"
      group="section"
      @start="handleDragStart"
      @end="handleDragEnd"
      item-key="key"
      ghost-class="repetable-section-ghost"
      handle=".drag_handle"
      :forceFallback="true"
      dragClass="repetable-section-cloned-element"
      direction="vertical"
    >
      <template #item="{ element }">
        <RepetableSection
          orderable
          class="repetable-section max-md:p-repetableMobile p-repetable"
          :value="element.value"
          :isMin="isMin"
          @inputChange="
            ({ name, value }) =>
              handleSectionInputChange(element.key, name, value)
          "
          @register="($v) => registerSection(element.key, $v)"
          @unregister="unregisterSection(element.key)"
        >
          <slot :data="element.value" />
        </RepetableSection>
      </template>
    </draggable>
    <template v-if="!orderable">
      <RepetableSection
        class="repetable-section max-md:p-repetableMobile p-repetable"
        v-for="section of sections"
        :key="section.key"
        :isMin="isMin"
        :value="section.value"
        @inputChange="
          ({ name, value }) =>
            handleSectionInputChange(section.key, name, value)
        "
        @register="($v) => registerSection(section.key, $v)"
        @unregister="unregisterSection(section.key)"
      >
        <slot :data="section.value" />
      </RepetableSection>
    </template>

    <div
      class="repetable-actions max-md:p-repetableMobile p-repetable"
      v-if="!isMax"
    >
      <Button @click="() => addSection()" v-if="!$slots['actions']">
        {{ buttonText || $t("add") }}
      </Button>
      <slot name="actions" :addSection="addSection" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual, isNil, uniqueId } from "lodash";
import useValidatable from "../../../composables/validatable";
import { computed, ref, watch } from "vue";
import { ValidationError, type AnySchema } from "yup";
import RepetableSection from "./RepetableSection.vue";
import Button from "../../Button.vue";
import draggable from "vuedraggable";

interface RepetableProps {
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  min?: number | undefined | null;
  max?: number | undefined | null;

  buttonText?: string;

  orderable?: boolean;
}

const props = withDefaults(defineProps<RepetableProps>(), {});
const emit = defineEmits(["update:modelValue", "update:error"]);

async function validate() {
  let valid = true;
  for (const section of Object.values(sections.value)) {
    valid = valid && (await section.validate());
  }
  if (!valid) {
    internalError.value = true;
    return false;
  }
  if (props.rules != null) {
    try {
      await props.rules.validate(internalValue.value);
      internalError.value = undefined;
      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        internalError.value = err.message;
      } else {
        throw err;
      }
      return false;
    }
  } else {
    internalError.value = false;
    return true;
  }
}

const { internalValue, internalError } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
  validate,
});

const sections = ref<
  {
    key: string;
    value: any;
    validate: () => Promise<boolean>;
    errors: any;
  }[]
>([]);

// eslint-disable-next-line @typescript-eslint/no-empty-function
function handleDragStart(e: any) {}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function handleDragEnd(e: any) {}

const generateId = () => uniqueId("section_");

function createSection(data?: any) {
  return {
    key: generateId(),
    value: data || {},
    validate: () => Promise.resolve(true),
    errors: null,
  };
}

const addSection = (data?: any) => {
  sections.value.push(createSection(data));
  internalValue.value = sections.value.map((v) => v.value);
};

const registerSection = (
  key: string,
  data: {
    validate: () => Promise<boolean>;
    errors: any;
  }
) => {
  const sectionIndex = sections.value.findIndex((s) => s.key === key);
  if (sectionIndex === -1) return;
  sections.value[sectionIndex] = {
    ...sections.value[sectionIndex],
    ...data,
  };
};
const unregisterSection = (key: string) => {
  sections.value = sections.value.filter((s) => s.key !== key);
  internalValue.value = sections.value.map((v) => v.value);
};

const isMax = computed(() => {
  if (!isNil(props.max) && props.max <= Object.keys(sections.value).length) {
    return true;
  }
  return false;
});
const isMin = computed(() => {
  if (!isNil(props.min) && props.min >= Object.keys(sections.value).length) {
    return true;
  }
  return false;
});

function handleSectionInputChange(key: string, name: string, value: any) {
  const sectionIndex = sections.value.findIndex((s) => s.key === key);
  if (sectionIndex === -1) return;
  sections.value[sectionIndex].value[name] = value;
  internalValue.value = sections.value.map((v) => v.value);
}

watch(
  () => internalValue.value,
  (newValue) => {
    if (newValue == null) {
      sections.value = [];
      return;
    }
    if (
      isEqual(
        newValue,
        sections.value.map((v) => v.value)
      )
    ) {
      return;
    }
    sections.value = newValue.map((v: any) => createSection(v));
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
.repetable-wrapper {
  label.repetable-label {
    display: block;
    margin-bottom: spacing(1);
  }
  .repetable-section {
    &:first-child {
      @apply rounded-t-md;
    }
    @apply border border-solid border-zinc-200 bg-zinc-50;
    &:not(:first-child) {
      border-top: 0;
    }
    background-color: color("zinc", 50);
    border-bottom: dashed 1px color("slate", 400);
    position: relative;
  }
  .repetable-actions {
    @apply border border-solid border-zinc-200 bg-zinc-50 border-t-0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: spacing(1.5);
    @apply rounded-b-md;
  }
}
</style>
