<template>
  <div class="color-picker" ref="colorPicker">
    <label v-if="label">
      {{ label }}
    </label>
    <Menu full-activator-width strategy="root" :gap="1">
      <template #activator>
        <Flex align-items="center" :gap="1.2">
          <button
            class="color-btn"
            :style="{ background: internalValue || '' }"
          >
            <Icon
              name="colorize"
              size="sm"
              :style="{ color: getContrastYIQ(internalValue || '') }"
            />
          </button>
          <Grid
            :columns="4"
            :gap="1.2"
            class="default-colors"
            @click.stop="($refs.colorPicker as HTMLElement).click()"
          >
            <button
              v-for="color of pickerDefaultColors"
              :key="color"
              :style="{ background: color }"
              class="default-color-btn"
              @click="internalValue = color"
            />
          </Grid>
        </Flex>
      </template>
      <template #content>
        <Flex :p="1" :style="{ width: 'max-content' }">
          <Text typo="title5">
            {{ $t("core.colorpicker.edit-color") }}
          </Text>
        </Flex>
        <div :style="{ background: 'red', height: '90px' }"></div>
      </template>
    </Menu>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Flex from "../../layouts/Flex.vue";
import Grid from "../../layouts/Grid.vue";
import Icon from "../../Icon.vue";
import { getContrastYIQ } from "../../../helpers/utils";
import useValidatable from "../../../composables/validatable";
import Menu from "../../Menu.vue";
import Text from "../../Text.vue";

type ColorPickerDefaultColors = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

interface ColorPickerProps {
  name?: string;
  label?: string;
  modelValue?: string;
  error?: string;
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: "#6366f1",
});

const { internalValue } = useValidatable({
  value: props.modelValue,
  error: props.error,
});

const pickerDefaultColors = ref<ColorPickerDefaultColors>([
  "#818CF8",
  "#A7F3D0",
  "#F178B6",
  "#F1F5F9",
  "#818CF8",
  "#7F1D1D",
  "#F87171",
  "#F1F5F9",
]);
</script>

<style lang="scss">
$pickerBtnSize: 50px;
$defaultColorBtnSize: 21px;
.color-picker {
  display: grid;
  gap: spacing(1);
  width: fit-content;
  .color-btn {
    width: $pickerBtnSize;
    height: $pickerBtnSize;
    border-radius: 999px;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.25),
      0px 1.6px 3.6px rgba(0, 0, 0, 0.28);
  }
  .default-colors {
    width: fit-content;
    .default-color-btn {
      width: $defaultColorBtnSize;
      height: $defaultColorBtnSize;
      border-radius: 5px;
      box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.25),
        0px 1.6px 3.6px rgba(0, 0, 0, 0.28);
    }
  }
}
</style>
