<template>
  <div class="color-picker" ref="colorPicker">
    <label v-if="label">
      {{ label }}
    </label>
    <Menu
      :disabled="!allowAllColors"
      strategy="root"
      :gap="1"
      v-bind="menuProps"
    >
      <template #activator>
        <div class="flex gap-3 items-center">
          <Avatar
            :selectable="allowAllColors"
            size="lg"
            :style="{ background: internalValue || '' }"
          >
            <Icon
              name="colorize"
              size="sm"
              :style="{
                color: getContrastYIQ(
                  isHex(internalValue || '')
                    ? internalValue || ''
                    : rgbToHex(internalValue || '')
                ),
              }"
            />
          </Avatar>
          <div
            class="default-colors grid grid-cols-4 gap-2"
            @click.stop="($refs.colorPicker as HTMLElement).click()"
          >
            <button
              v-for="color of pickerDefaultColors"
              :key="color"
              :style="{ background: color }"
              class="default-color-btn"
              @click="(internalValue = color), (hexaInput = color)"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div @click.stop>
          <div class="flex p-3 w-max">
            <Text typo="title5">
              {{ $t("core.colorpicker.edit-color") }}
            </Text>
          </div>
          <canvas
            class="relative cursor-pointer min-w-[290px] w-full h-[100px]"
            ref="canvasRef"
          ></canvas>
          <div class="p-3">
            <canvas
              class="relative cursor-pointer w-full h-[20px] rounded-full mb-2"
              ref="canvasColorsLineRef"
            ></canvas>
            <div class="flex gap-4 items-center">
              <Text typo="title7">HEXA</Text>
              <Input
                rounded="full"
                :model-value="hexaInput"
                @update:model-value="handleChangeHexa($event)"
              />
            </div>
          </div>
        </div>
      </template>
    </Menu>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Icon from "../../Icon.vue";
import useValidatable from "../../../composables/validatable";
import Menu from "../../Menu.vue";
import Text from "../../Text.vue";
import Avatar from "../../Avatar.vue";
import { onMounted } from "vue";
import Input from "../Input.vue";
import type { MenuProps } from "src/composables/menu";
import { watch } from "vue";

type ColorPickerDefaultColors = string[];

interface ColorPickerProps {
  name?: string;
  label?: string;
  modelValue?: string;
  error?: string;

  allowAllColors?: boolean;
  menuProps?: MenuProps;
  defaultColos?: ColorPickerDefaultColors;
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: "#6366f1",
});

const { internalValue } = useValidatable({
  value: props.modelValue,
  error: props.error,
});

const canvasRef = ref<HTMLCanvasElement>();
const canvasColorsLineRef = ref<HTMLCanvasElement>();

const colorLineColor = ref<string>();
const hexaInput = ref<string>(props.modelValue);

function handleChangeHexa(val: string) {
  if (!val) return;
  if (!isHex(val)) return;
  if (internalValue.value === val) return;
  internalValue.value = val;
  colorLineColor.value = val;
}

const pickerDefaultColors: ColorPickerDefaultColors = props.defaultColos || [
  "#818CF8",
  "#A7F3D0",
  "#F178B6",
  "#F1F5F9",
  "#818CF8",
  "#7F1D1D",
  "#F87171",
  "#F1F5F9",
];

function drawColorsLine() {
  const colorLineCanvas = canvasColorsLineRef.value;
  if (!colorLineCanvas) return;
  const context = colorLineCanvas.getContext("2d");
  if (!context) return;
  const gradientH = context.createLinearGradient(0, 0, context.canvas.width, 0);
  gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
  gradientH.addColorStop(1 / 6, "rgb(255, 255, 0)"); // yellow
  gradientH.addColorStop(2 / 6, "rgb(0, 255, 0)"); // green
  gradientH.addColorStop(3 / 6, "rgb(0, 255, 255)");
  gradientH.addColorStop(4 / 6, "rgb(0, 0, 255)"); // blue
  gradientH.addColorStop(5 / 6, "rgb(255, 0, 255)");
  gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
  context.fillStyle = gradientH;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawColorCanvas(defaultColor?: string) {
  const colorCanvas = canvasRef.value;
  if (!colorCanvas) return;
  const ColorCtx = colorCanvas.getContext("2d");
  if (!ColorCtx) return;
  // Create a horizontal gradient
  const color = defaultColor || "#0000ff";
  const gradientH = ColorCtx.createLinearGradient(
    0,
    0,
    ColorCtx.canvas.width,
    0
  );
  gradientH.addColorStop(0, "#fff");
  gradientH.addColorStop(1, color);
  ColorCtx.fillStyle = gradientH;
  ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, ColorCtx.canvas.height);
  // Create a Vertical Gradient(white to black)
  const gradientV = ColorCtx.createLinearGradient(0, 0, 0, 300);
  gradientV.addColorStop(0, "rgba(0,0,0,0)");
  gradientV.addColorStop(1, "#000");
  ColorCtx.fillStyle = gradientV;
  ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, ColorCtx.canvas.height);
}

function addClickCanvasListener() {
  const colorCanvas = canvasRef.value;
  if (!colorCanvas) return;
  const ColorCtx = colorCanvas.getContext("2d"); // This create a 2D context for the canvas
  if (!ColorCtx) return;
  colorCanvas.addEventListener("click", (event: MouseEvent) => {
    const x = event.clientX - colorCanvas.getBoundingClientRect().left;
    const y = event.clientY - colorCanvas.getBoundingClientRect().top;
    const pixel = ColorCtx.getImageData(x, y, 1, 1)["data"];
    const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    const hex = rgbToHex(rgb);
    internalValue.value = hex;
    hexaInput.value = hex;
  });
}

function addClickColorsLineListener() {
  const colorLineCanvas = canvasColorsLineRef.value;
  if (!colorLineCanvas) return;
  const context = colorLineCanvas.getContext("2d");
  if (!context) return;
  colorLineCanvas.addEventListener("click", (event: MouseEvent) => {
    const x = event.clientX - colorLineCanvas.getBoundingClientRect().left;
    const y = event.clientY - colorLineCanvas.getBoundingClientRect().top;
    const pixel = context.getImageData(x, y, 1, 1)["data"];
    const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    colorLineColor.value = rgbToHex(rgb);
  });
}

onMounted(() => {
  drawColorCanvas();
  drawColorsLine();

  addClickCanvasListener();
  addClickColorsLineListener();
});
function isHex(str: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(str);
}
function rgbToHex(rbg: string): string {
  const rgb = rbg.replace("rgb(", "").replace(")", "").split(",");
  const r = parseInt(rgb[0], 10).toString(16);
  const g = parseInt(rgb[1], 10).toString(16);
  const b = parseInt(rgb[2], 10).toString(16);
  return `#${r.length === 1 ? `0${r}` : r}${g.length === 1 ? `0${g}` : g}${
    b.length === 1 ? `0${b}` : b
  }`;
}
function hexToRgb(hexcolor: string): string {
  const color = hexcolor.startsWith("#") ? hexcolor.substring(1) : hexcolor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return `rgb(${r},${g},${b})`;
}

function getContrastYIQ(hexcolor: string) {
  const color = hexcolor.startsWith("#") ? hexcolor.substring(1) : hexcolor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

watch(
  () => colorLineColor.value,
  (color) => {
    if (!color) return;
    drawColorCanvas(color);
  }
);
</script>

<style lang="scss">
$pickerBtnSize: 50px;
$defaultColorBtnSize: 21px;

.color-picker {
  display: grid;
  gap: spacing(1);
  width: fit-content;

  .default-colors {
    width: fit-content;

    .default-color-btn {
      width: $defaultColorBtnSize;
      height: $defaultColorBtnSize;
      border-radius: 5px;
      @apply shadow-avatar;
    }
  }
}
</style>
