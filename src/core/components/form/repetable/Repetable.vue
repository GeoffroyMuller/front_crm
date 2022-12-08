<template>
  <div class="repetable-wrapper">
    <label class="repetable-label" v-if="label">
      {{ label }}
    </label>
    <Card :withPadding="false" class="repetable">
      <RepetableSection
        class="repetable-section"
        v-for="(section, key) in sections"
        :key="key"
        :value="section"
        @inputChange="({ name, value }) => handleSectionInputChange(key, name, value)"
      >
        <slot :data="section" />
        <div class="icon-delete">
          <div>
            <IconButton
              class=""
              name="delete"
              color="danger"
              v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
              @click="handleDeleteSection(key)"
            />
          </div>
        </div>
      </RepetableSection>
      <div class="repetable-actions">
        <Button @click="() => addSection()" v-if="!$slots['actions']">
          {{ buttonText || $t("add") }}
        </Button>
        <slot name="actions" :addSection="addSection" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import useValidatable from "../../../helpers/vue/composables/validatable";
import type { AnySchema } from "yup";
import { computed, ref, watch } from "vue";
import { isEmpty, isEqual, uniqueId } from "lodash";
import RepetableSection from "./RepetableSection.vue";
import Button from "../../Button.vue";
import Card from "../../Card.vue";
import IconButton from "../../IconButton.vue";

export interface ISection {
  [name: string]: any;
}

interface RepetableProps {
  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
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
}

const props = withDefaults(defineProps<RepetableProps>(), {});
const emit = defineEmits(["update:modelValue", "update:error", "sectionChange"]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const sections = ref<{ [key: string]: ISection }>({});

const generateId = () => uniqueId();

function addSection(data?: any) {
  sections.value = {
    ...sections.value,
    [generateId()]: data || {},
  };
}

function handleSectionInputChange(key: string, inputName: string, inputValue: any) {
  sections.value[key] = {
    ...sections.value[key],
    [inputName]: inputValue,
  };
  emit("sectionChange", sections.value[key]);
}

function handleDeleteSection(key: string) {
  delete sections.value[key];
}

const sectionsList = computed(() =>
  Object.values(sections.value).filter((obj: any) => !isEmpty(obj))
);

watch(
  () => internalValue.value,
  () => {
    if (internalValue.value == null) {
      return;
    }
    if (internalValue.value?.length > 0 && sectionsList.value.length === 0) {
      sections.value = internalValue.value.reduce(
        (prev: { [key: string]: ISection }, section: ISection) => {
          return { ...prev, [generateId()]: section };
        },
        {}
      );
    }
  },
  { immediate: true }
);
watch(
  () => sectionsList.value,
  () => {
    if (sectionsList.value?.length && !isEqual(sectionsList.value, internalValue.value)) {
      internalValue.value = sectionsList.value;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.repetable-wrapper {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: spacing(1);
  label.repetable-label {
    @include typo(text2);
  }
  .repetable {
    display: flex;
    width: 100%;
    flex-direction: column;
    .repetable-section,
    .repetable-actions {
      padding: 0 spacing(2);
      padding: spacing(1) spacing(2);
    }
    .repetable-section {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      position: relative;
      .icon-delete {
        position: absolute;
        top: spacing(1);
        right: spacing(1);
      }
    }
    .repetable-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
