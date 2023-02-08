<template>
  <Menu class="emoji-picker">
    <template #activator>
      <label>
        {{ label }}
      </label>
      <Card :with-padding="false">
        {{ internalValue }}
      </Card>
    </template>
    <template #content>
      <div class="emojis">
        <div
          v-for="emoji of emojis"
          :key="emoji"
          @click="internalValue = emoji"
          class="emoji"
        >
          {{ emoji }}
        </div>
      </div>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import useValidatable from "@/core/helpers/vue/composables/validatable";
import Menu from "../Menu.vue";
import Card from "../Card.vue";
import { onMounted } from "vue";

export interface EmojiPickerProps {
  label?: string;
  modelValue?: any;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
}

function generateEmojis() {
  let res: Array<string> = [];
  const emojRange = [
    [128512, 128567], // head
    [128577, 128580], // head
    [129296, 129303], // head
    [129312, 129327], // head
    [129488, 129488], // head
    [128066, 128080], // body
    [129304, 129305], // body
  ];
  function generateEmojisCode(
    range0: number,
    range1: number,
    withSkinTones?: boolean
  ) {
    const codes = [];
    for (let i = range0; i <= range1; i++) {
      codes.push(String.fromCodePoint(i));
      /* if (withSkinTones) {
        codes.push(String.fromCodePoint(i) + String.fromCodePoint(127999));
        codes.push(String.fromCodePoint(i) + String.fromCodePoint(127998));
        codes.push(String.fromCodePoint(i) + String.fromCodePoint(127997));
        codes.push(String.fromCodePoint(i) + String.fromCodePoint(127996));
        codes.push(String.fromCodePoint(i) + String.fromCodePoint(127995));
      } */
    }
    return codes;
  }
  for (const range of emojRange) {
    // @ts-ignore
    res = [...res, ...generateEmojisCode(range[0], range[1], range?.[2])];
  }
  return res;
}

const emojis = generateEmojis();

console.error(emojis.length);
const props = withDefaults(defineProps<EmojiPickerProps>(), {});

const emit = defineEmits(["update:modelValue"]);

const { internalValue } = useValidatable({
  error: props.error,
  value: props.modelValue,
});
</script>

<style lang="scss">
.emoji-picker {
  display: grid;
  gap: spacing(1);
  cursor: pointer;
  width: fit-content;

  label {
    @include typo(text2);
  }

  > *:last-child {
    width: spacing(5);
    height: spacing(5);
    display: grid;
    place-items: center;
    user-select: none;
    font-size: 1.5rem;
  }
}

.emojis {
  max-height: 200px;
  overflow-y: auto;
  user-select: none;
  @include grid(5, 0, 1);
  place-items: center;
  padding-top: spacing(1);
  padding-bottom: spacing(1);

  .emoji {
    cursor: pointer;
    font-size: 1.3rem;
    padding: spacing(0.25);
  }
}
</style>
