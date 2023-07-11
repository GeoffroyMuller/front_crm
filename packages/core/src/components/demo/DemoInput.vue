<template>
  <div class="flex flex-wrap gap-2">
    <Input type="number" />
    <Input type="number" appearance-none />
    <Input icon="verified_user" />
    <Input icon="verified_user" error="sqdqs" />
    <Input icon="home" disabled />
    <Input icon="home" v-model="inputValue" @keypress="handleKeyPress">
      <template #start>
        <div class="flex items-center">
          <Chip
            v-for="(chip, index) in chips"
            :key="index"
            is-closable
            @close="handleDeleteChip(index)"
            >{{ chip }}</Chip
          >
        </div>
      </template>
    </Input>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Chip from "../Chip.vue";
import Input from "../form/Input.vue";

const chips = ref<string[]>([]);
const inputValue = ref("");

function handleKeyPress(e: KeyboardEvent) {
  if (e.key !== "Enter") return;
  chips.value.push(inputValue.value);
  inputValue.value = "";
}

function handleDeleteChip(index: number) {
  chips.value = chips.value.filter((c, i) => i !== index);
}
</script>
