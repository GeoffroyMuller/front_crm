<template>
  <div class="repetable-wrapper">
    <label class="repetable-label" v-if="label">
      {{ label }}
    </label>
    <Card :withPadding="false" class="repetable">
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
            class="repetable-section"
            :value="element.value"
            @inputChange="
              ({ name, value }) =>
                handleSectionInputChange(element.key, name, value)
            "
            @register="($v) => registerSection(element.key, $v)"
          >
            <div class="icon-delete" v-if="!isMin">
              <div>
                <IconButton
                  class=""
                  name="close"
                  color="danger"
                  v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
                  @click.stop="unregisterSection(element.key)"
                />
              </div>
            </div>
            <slot :data="element.value" />
          </RepetableSection>
        </template>
      </draggable>
      <template v-if="!orderable">
        <RepetableSection
          class="repetable-section"
          v-for="section of sections"
          :key="section.key"
          :value="section.value"
          @inputChange="
            ({ name, value }) =>
              handleSectionInputChange(section.key, name, value)
          "
          @register="($v) => registerSection(section.key, $v)"
        >
          <div class="icon-delete" v-if="!isMin">
            <div>
              <IconButton
                class=""
                name="close"
                color="danger"
                v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
                @click.stop="unregisterSection(section.key)"
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
import { isEqual, isNil, uniqueId } from "lodash";
import useValidatable from "../../../composables/validatable";
import { computed, ref, watch } from "vue";
import { ValidationError, type AnySchema } from "yup";
import RepetableSection from "./RepetableSection.vue";
import Button from "../../Button.vue";
import Card from "../../Card.vue";
import IconButton from "../../IconButton.vue";
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
