<template>
  <div class="repetable-wrapper">
    <label class="repetable-label" v-if="label">
      {{ label }}
    </label>
    <Card :withPadding="false" class="repetable">
      <draggable
        v-if="orderable"
        v-model="sectionListForDnD"
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
          <template v-if="element.value">
            <RepetableSection
              orderable
              class="repetable-section"
              :value="element.value"
              @inputChange="
                ({ name, value }) =>
                  handleSectionInputChange(element.key, name, value)
              "
              @register="($v) => registerValidator(element.key, $v)"
              @unregister="() => unregisterValidator(element.key)"
            >
              <div class="icon-delete" v-if="!isMin">
                <div>
                  <IconButton
                    class=""
                    name="close"
                    color="danger"
                    v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
                    @click.stop="handleDeleteSection(element.key)"
                  />
                </div>
              </div>
              <slot :data="element.value" />
            </RepetableSection>
          </template>
        </template>
      </draggable>
      <template v-if="!orderable">
        <RepetableSection
          class="repetable-section"
          v-for="(section, key) in sections"
          :key="key"
          :value="section"
          @inputChange="
            ({ name, value }) => handleSectionInputChange(key, name, value)
          "
          @register="($v) => registerValidator(key, $v)"
          @unregister="() => unregisterValidator(key)"
        >
          <div class="icon-delete" v-if="!isMin">
            <div>
              <IconButton
                class=""
                name="close"
                color="danger"
                v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
                @click.stop="handleDeleteSection(key)"
              />
            </div>
          </div>
          <slot :data="section" />
        </RepetableSection>
      </template>

      <div class="repetable-actions" v-if="!isMax">
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
import { ValidationError, type AnySchema } from "yup";
import { computed, ref, watch } from "vue";
import { isEqual, isNil, uniqueId } from "lodash";
import RepetableSection from "./RepetableSection.vue";
import Button from "../../Button.vue";
import Card from "../../Card.vue";
import IconButton from "../../IconButton.vue";
import draggable from "vuedraggable";

export interface ISection {
  [name: string]: any;
}

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
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "sectionChange",
]);

const sections = ref<{ [key: string]: ISection }>({});
const sectionsValidators = ref<{
  [key: string]: {
    validate: () => Promise<boolean | string>;
    errors: any;
  };
}>({});

function registerValidator(
  key: string,
  obj: {
    validate: () => Promise<boolean | string>;
    errors: any;
  }
) {
  sectionsValidators.value[key] = obj;
}

function unregisterValidator(key: string) {
  delete sectionsValidators.value[key];
}

async function validate() {
  let valid = true;
  for (const v of Object.values(sectionsValidators.value)) {
    valid = valid && (await v.validate());
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

const keyOrderForDnD = ref<string[]>([]);
const sectionListForDnD = computed({
  get: () => {
    const res: { key: string; value: any }[] = [];
    for (const key of keyOrderForDnD.value) {
      const value = sections.value[key];
      res.push({ key, value });
    }

    return [
      ...res,
      ...Object.keys(sections.value)
        .filter((k) => !keyOrderForDnD.value.find((key) => k == key))
        .map((key) => ({
          key,
          value: sections.value[key],
        })),
    ];
  },
  set: (val) => {
    const obj: { [key: string]: ISection } = {};
    const order: string[] = [];
    for (const kv of val) {
      obj[kv.key] = kv.value;
      order.push(kv.key);
    }
    keyOrderForDnD.value = order;
    sections.value = obj;
  },
});

function handleDragStart(e: any) {}
function handleDragEnd(e: any) {}

const generateId = () => uniqueId();

function addSection(data?: any) {
  const key = generateId();
  keyOrderForDnD.value.push(key);

  sections.value = {
    ...sections.value,
    [key]: data || {},
  };
}

function handleSectionInputChange(
  key: string,
  inputName: string,
  inputValue: any
) {
  if (isEqual(sections.value[key][inputName], inputValue)) {
    return;
  }
  sections.value[key] = {
    ...sections.value[key],
    [inputName]: inputValue,
  };
  emit("sectionChange", sections.value[key]);
}

function handleDeleteSection(key: string) {
  delete sections.value[key];
  keyOrderForDnD.value = keyOrderForDnD.value.filter((k) => k != key);
}

const sectionsList = computed(() =>
  sectionListForDnD.value.map(({ value }) => value).filter((v) => v != null)
);

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

watch(
  () => internalValue.value,
  () => {
    if (internalValue.value == null) {
      return;
    }
    if (internalValue.value?.length > 0 && sectionsList.value.length === 0) {
      sections.value = internalValue.value.reduce(
        (prev: { [key: string]: ISection }, section: ISection) => {
          const key = generateId();
          keyOrderForDnD.value.push(key);
          return { ...prev, [key]: section };
        },
        {}
      );
    } else {
      if (!isEqual(sectionsList.value, internalValue.value)) {
        sections.value = internalValue.value.reduce(
          (prev: { [key: string]: ISection }, section: ISection) => {
            const key = generateId();
            keyOrderForDnD.value.push(key);
            return { ...prev, [key]: section };
          },
          {}
        );
      }
    }
  },
  { immediate: true }
);
watch(
  () => sectionsList.value,
  () => {
    if (!isEqual(sectionsList.value, internalValue.value)) {
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
      padding: spacing(2);
      .icon-delete {
        position: absolute;
        top: spacing(1);
        right: spacing(2);
      }
    }
    .repetable-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: spacing(1);
      @include flex-separator();
    }
  }
}
</style>
